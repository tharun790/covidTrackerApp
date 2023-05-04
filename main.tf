provider "aws" {
  region = "us-east-1" 
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "tharun-covid19" 
  acl = "private"       
  tags = {
    Name = "My S3 Bucket"
  }
}

resource "aws_s3_bucket_object" "example_object" {
  bucket = aws_s3_bucket.my_bucket.id
  key = "covid19data.csv"                  
  source = "C:\\Users\\LENOVO\\Documents\\covid19data.csv"      
  content_type = "text/csv"            
}
resource "aws_s3_bucket" "athena_results" {
  bucket = "thlambda"
  acl    = "public"
}
