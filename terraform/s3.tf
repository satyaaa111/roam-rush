resource "aws_s3_bucket" "uploads" {
  bucket = "roamrush-uploads-${terraform.workspace}-${random_id.bucket_prefix.hex}"
}

resource "aws_s3_bucket_public_access_block" "uploads_pab" {
  bucket = aws_s3_bucket.uploads.id 

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "random_id" "bucket_prefix" {
  byte_length = 8
}