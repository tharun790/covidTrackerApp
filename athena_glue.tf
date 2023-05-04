
# S3 bucket for data
resource "aws_s3_bucket" "tharun-covid19" {
  bucket = "tharun-covid19"
  acl    = "private"
}

# Glue Table
resource "aws_glue_catalog_table" "th_table" {
  name = "th_table"
  database_name = "thdatabase"
  table_type = "EXTERNAL_TABLE"
  parameters = {
    "classification" = "csv"
    "delimiter" = ","
    "skip.header.line.count" = "1"
  }
  storage_descriptor {
    location = "s3://${aws_s3_bucket.tharun-covid19.id}"
    input_format = "org.apache.hadoop.mapred.TextInputFormat"
    output_format = "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat"
    serde_info {
      serialization_library = "org.apache.hadoop.hive.serde2.OpenCSVSerde"
      parameters = {
        "separatorChar" = ","
      }
    }
  }
}
