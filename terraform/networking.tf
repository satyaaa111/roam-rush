# Get your default VPC and subnets (simplifies this demo)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# --- 1. Public Load Balancer Security Group ---
# Allows anyone on the internet (0.0.0.0/0) to access our site on port 80
resource "aws_security_group" "alb_public" {
  name        = "roamrush-alb-public-sg"
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

# --- 2. Frontend Service Security Group ---
# Allows traffic ONLY from the Public Load Balancer
resource "aws_security_group" "frontend_ecs" {
  name        = "roamrush-frontend-ecs-sg"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from public ALB to frontend"

  ingress {
    from_port       = 3000 # Your Next.js port
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_public.id] # <-- ONLY from this SG
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 3. Internal Load Balancer Security Group ---
# Allows traffic ONLY from the Frontend containers
resource "aws_security_group" "alb_internal" {
  name        = "roamrush-alb-internal-sg"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from frontend to backend"

  ingress {
    from_port       = 8080 # Your Spring Boot port
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend_ecs.id] # <-- ONLY from this SG
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 4. Backend Service Security Group ---
# Allows traffic ONLY from the Internal Load Balancer
resource "aws_security_group" "backend_ecs" {
  name        = "roamrush-backend-ecs-sg"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from internal ALB to backend"

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_internal.id] # <-- ONLY from this SG
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- 5. Database Security Group ---
# Allows traffic ONLY from the Backend containers
resource "aws_security_group" "database" {
  name        = "roamrush-database-sg"
  vpc_id      = data.aws_vpc.default.id
  description = "Allows traffic from backend to databases"

  ingress {
    from_port       = 5432 # Postgres
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_ecs.id] # <-- ONLY from this SG
  }

  ingress {
    from_port       = 27017 # DocumentDB (Mongo)
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_ecs.id] # <-- ONLY from this SG
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}