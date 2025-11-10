# Get your default VPC and subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 1. Public LB Security Group (Allows internet)
resource "aws_security_group" "alb_public" {
  name        = "roamrush-alb-public-sg-${terraform.workspace}"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows HTTP traffic from the internet"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Frontend Service Security Group (Allows Public LB)
resource "aws_security_group" "frontend_ecs" {
  name        = "roamrush-frontend-ecs-sg-${terraform.workspace}"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from public ALB to frontend"

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_public.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. Internal LB Security Group (Allows Frontend)
resource "aws_security_group" "alb_internal" {
  name        = "roamrush-alb-internal-sg-${terraform.workspace}"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from frontend to backend"

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend_ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Backend Service Security Group (Allows Internal LB)
resource "aws_security_group" "backend_ecs" {
  name        = "roamrush-backend-ecs-sg-${terraform.workspace}"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from internal ALB to backend"

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_internal.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 5. Database Security Group (Allows Backend)
resource "aws_security_group" "database" {
  name        = "roamrush-database-sg-${terraform.workspace}"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from backend to databases"

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_ecs.id]
  }

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_ecs.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}