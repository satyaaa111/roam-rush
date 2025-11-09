resource "aws_ecr_repository" "backend" {
  name = "roamrush/backend"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "frontend" {
  name = "roamrush/frontend"
  image_tag_mutability = "MUTABLE"
}