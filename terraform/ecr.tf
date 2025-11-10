resource "aws_ecr_repository" "backend" {
  name = "roamrush/backend-${terraform.workspace}"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "frontend" {
  name = "roamrush/frontend-${terraform.workspace}"
  image_tag_mutability = "MUTABLE"
}