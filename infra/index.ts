import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Configuration
const config = new pulumi.Config();
const appName = "todo-app";
const environment = config.get("env") || "dev";

// VPC Configuration
export class NetworkStack {
  public vpc: aws.ec2.Vpc;
  public publicSubnets: aws.ec2.Subnet[];
  public privateSubnets: aws.ec2.Subnet[];
  public internetGateway: aws.ec2.InternetGateway;
  public natGateways: aws.ec2.NatGateway[];
  public publicRouteTable: aws.ec2.RouteTable;
  public privateRouteTables: aws.ec2.RouteTable[];

  constructor() {
    // Create VPC
    this.vpc = new aws.ec2.Vpc(`${appName}-vpc`, {
      cidrBlock: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: {
        Name: `${appName}-vpc`,
        Environment: environment,
      },
    });

    // Create Internet Gateway
    this.internetGateway = new aws.ec2.InternetGateway(`${appName}-igw`, {
      vpcId: this.vpc.id,
      tags: { Name: `${appName}-igw` },
    });

    // Create Public Subnets (3 for high availability)
    this.publicSubnets = [
      "ap-southeast-1a",
      "ap-southeast-1b",
      "ap-southeast-1c",
    ].map(
      (az, index) =>
        new aws.ec2.Subnet(`${appName}-public-subnet-${index + 1}`, {
          vpcId: this.vpc.id,
          cidrBlock: `10.0.${index + 1}.0/24`,
          availabilityZone: az,
          mapPublicIpOnLaunch: true,
          tags: {
            Name: `${appName}-public-subnet-${index + 1}`,
            Type: "Public",
          },
        })
    );

    // Create Private Subnets (3 for high availability)
    this.privateSubnets = [
      "ap-southeast-1a",
      "ap-southeast-1b",
      "ap-southeast-1c",
    ].map(
      (az, index) =>
        new aws.ec2.Subnet(`${appName}-private-subnet-${index + 1}`, {
          vpcId: this.vpc.id,
          cidrBlock: `10.0.${index + 10}.0/24`,
          availabilityZone: az,
          tags: {
            Name: `${appName}-private-subnet-${index + 1}`,
            Type: "Private",
          },
        })
    );

    // Elastic IPs for NAT Gateways
    const elasticIPs = this.publicSubnets.map(
      (subnet, index) =>
        new aws.ec2.Eip(`${appName}-nat-eip-${index + 1}`, {
          vpc: true,
          tags: { Name: `${appName}-nat-eip-${index + 1}` },
        })
    );

    // NAT Gateways
    this.natGateways = this.publicSubnets.map(
      (subnet, index) =>
        new aws.ec2.NatGateway(`${appName}-nat-gw-${index + 1}`, {
          allocationId: elasticIPs[index].id,
          subnetId: subnet.id,
          tags: { Name: `${appName}-nat-gw-${index + 1}` },
        })
    );

    // Public Route Table
    this.publicRouteTable = new aws.ec2.RouteTable(`${appName}-public-rt`, {
      vpcId: this.vpc.id,
      routes: [
        {
          cidrBlock: "0.0.0.0/0",
          gatewayId: this.internetGateway.id,
        },
      ],
      tags: { Name: `${appName}-public-rt` },
    });

    // Public Subnet Route Table Associations
    this.publicSubnets.forEach(
      (subnet, index) =>
        new aws.ec2.RouteTableAssociation(
          `${appName}-public-rta-${index + 1}`,
          {
            subnetId: subnet.id,
            routeTableId: this.publicRouteTable.id,
          }
        )
    );

    // Private Route Tables
    this.privateRouteTables = this.privateSubnets.map((subnet, index) => {
      const routeTable = new aws.ec2.RouteTable(
        `${appName}-private-rt-${index + 1}`,
        {
          vpcId: this.vpc.id,
          routes: [
            {
              cidrBlock: "0.0.0.0/0",
              natGatewayId: this.natGateways[index].id,
            },
          ],
          tags: { Name: `${appName}-private-rt-${index + 1}` },
        }
      );

      // Private Subnet Route Table Associations
      new aws.ec2.RouteTableAssociation(`${appName}-private-rta-${index + 1}`, {
        subnetId: subnet.id,
        routeTableId: routeTable.id,
      });

      return routeTable;
    });
  }
}

// Security Group Configuration
export class SecurityGroups {
  public albSecurityGroup: aws.ec2.SecurityGroup;
  public ec2SecurityGroup: aws.ec2.SecurityGroup;

  constructor(vpc: aws.ec2.Vpc) {
    // ALB Security Group
    this.albSecurityGroup = new aws.ec2.SecurityGroup(`${appName}-alb-sg`, {
      vpcId: vpc.id,
      description: "Security group for ALB",
      ingress: [
        {
          protocol: "tcp",
          fromPort: 80,
          toPort: 80,
          cidrBlocks: ["0.0.0.0/0"],
        },
        {
          protocol: "tcp",
          fromPort: 443,
          toPort: 443,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        {
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      tags: { Name: `${appName}-alb-sg` },
    });

    // EC2 Instances Security Group
    this.ec2SecurityGroup = new aws.ec2.SecurityGroup(`${appName}-ec2-sg`, {
      vpcId: vpc.id,
      description: "Security group for EC2 instances",
      ingress: [
        // Allow traffic from ALB
        {
          protocol: "tcp",
          fromPort: 80,
          toPort: 80,
          securityGroups: [this.albSecurityGroup.id],
        },
        // SSH access
        {
          protocol: "tcp",
          fromPort: 22,
          toPort: 22,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        {
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      tags: { Name: `${appName}-ec2-sg` },
    });
  }
}

// Launch Template for EC2 Instances
export class LaunchConfiguration {
  public launchTemplate: aws.ec2.LaunchTemplate;

  constructor(securityGroupId: pulumi.Input<string>) {
    // User data script for Docker and Nginx on Ubuntu 22.04
    const userData = pulumi.all([]).apply(() => {
      return Buffer.from(
        `#!/bin/bash
          # Update system
          sudo apt-get update -y
          sudo apt-get upgrade -y
  
          # Install necessary dependencies
          sudo apt-get install -y ca-certificates curl gnupg lsb-release
  
          # Add Docker's official GPG key
          sudo mkdir -p /etc/apt/keyrings
          curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  
          # Set up Docker repository
          echo \
            "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  
          # Install Docker Engine
          sudo apt-get update -y
          sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  
          # Add current user to docker group
          sudo usermod -aG docker ubuntu
  
          # Install Nginx
          sudo apt-get install -y nginx
          sudo systemctl start nginx
          sudo systemctl enable nginx
  
          # Pull and run frontend and backend containers
          sudo docker pull mohaiminuleraj/todo-frontend:1.0
          sudo docker pull mohaiminuleraj/todo-backend:1.0
          
          sudo docker run -d -p 3000:3000 mohaiminuleraj/todo-frontend:1.0
          sudo docker run -d -p 8080:8080 mohaiminuleraj/todo-backend:1.0
        `
      ).toString("base64");
    });

    // Launch Template
    this.launchTemplate = new aws.ec2.LaunchTemplate(
      `${appName}-launch-template`,
      {
        name: `${appName}-launch-template`,
        imageId: "ami-045f9c1ecb56d9532",
        instanceType: "t2.micro",

        networkInterfaces: [
          {
            associatePublicIpAddress: "true",
            securityGroups: [securityGroupId],
          },
        ],

        userData: userData,

        tags: {
          Name: `${appName}-launch-template`,
          Environment: environment,
        },
      }
    );
  }
}

// Auto Scaling Group
export class AutoScalingGroup {
  public asg: aws.autoscaling.Group;

  constructor(
    subnets: aws.ec2.Subnet[],
    launchTemplateId: pulumi.Input<string>,
    targetGroupArn: pulumi.Input<string>
  ) {
    this.asg = new aws.autoscaling.Group(`${appName}-asg`, {
      desiredCapacity: 2,
      maxSize: 4,
      minSize: 2,

      vpcZoneIdentifiers: subnets.map((subnet) => subnet.id),

      launchTemplate: {
        id: launchTemplateId,
        version: "$Latest",
      },

      tags: [
        {
          key: "Name",
          value: `${appName}-instance`,
          propagateAtLaunch: true,
        },
      ],

      healthCheckType: "ELB",
      healthCheckGracePeriod: 300,

      targetGroupArns: [targetGroupArn],
    });

    // Scaling Policies
    const scaleUpPolicy = new aws.autoscaling.Policy(`${appName}-scale-up`, {
      scalingAdjustment: 1,
      adjustmentType: "ChangeInCapacity",
      cooldown: 60,
      autoscalingGroupName: this.asg.name,
    });

    const scaleDownPolicy = new aws.autoscaling.Policy(
      `${appName}-scale-down`,
      {
        scalingAdjustment: -1,
        adjustmentType: "ChangeInCapacity",
        cooldown: 60,
        autoscalingGroupName: this.asg.name,
      }
    );
  }
}

// Application Load Balancer
export class LoadBalancer {
  public alb: aws.lb.LoadBalancer;
  public targetGroup: aws.lb.TargetGroup;

  constructor(
    vpc: aws.ec2.Vpc,
    subnets: aws.ec2.Subnet[],
    securityGroup: aws.ec2.SecurityGroup
  ) {
    // Target Group
    this.targetGroup = new aws.lb.TargetGroup(`${appName}-tg`, {
      port: 80,
      protocol: "HTTP",
      vpcId: vpc.id,
      healthCheck: {
        enabled: true,
        path: "/",
        healthyThreshold: 3,
        unhealthyThreshold: 3,
        timeout: 5,
        interval: 30,
        matcher: "200-399",
      },
    });

    // Application Load Balancer
    this.alb = new aws.lb.LoadBalancer(`${appName}-alb`, {
      internal: false,
      loadBalancerType: "application",
      securityGroups: [securityGroup.id],
      subnets: subnets.map((subnet) => subnet.id),

      tags: {
        Name: `${appName}-alb`,
        Environment: environment,
      },
    });

    // Listener
    const listener = new aws.lb.Listener(`${appName}-listener`, {
      loadBalancerArn: this.alb.arn,
      port: 80,
      protocol: "HTTP",
      defaultActions: [
        {
          type: "forward",
          targetGroupArn: this.targetGroup.arn,
        },
      ],
    });
  }
}

// Main Stack Composition
export const infraStack = () => {
  // Network Stack
  const networkStack = new NetworkStack();

  // Security Groups
  const securityGroups = new SecurityGroups(networkStack.vpc);

  // Launch Configuration
  const launchConfig = new LaunchConfiguration(
    securityGroups.ec2SecurityGroup.id
  );

  // Load Balancer
  const loadBalancer = new LoadBalancer(
    networkStack.vpc,
    networkStack.publicSubnets,
    securityGroups.albSecurityGroup
  );

  // Auto Scaling Group
  const autoScalingGroup = new AutoScalingGroup(
    networkStack.privateSubnets,
    launchConfig.launchTemplate.id,
    loadBalancer.targetGroup.arn
  );

  // Outputs
  return {
    vpcId: networkStack.vpc.id,
    publicSubnetIds: networkStack.publicSubnets.map((subnet) => subnet.id),
    privateSubnetIds: networkStack.privateSubnets.map((subnet) => subnet.id),
    albDnsName: loadBalancer.alb.dnsName,
    asgName: autoScalingGroup.asg.name,
  };
};

// Export the infrastructure stack
export const { vpcId, publicSubnetIds, privateSubnetIds, albDnsName, asgName } =
  infraStack();
