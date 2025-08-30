import express from "express";
import path from "path";
import pkg from "aws-sdk";
import mime from "mime-types";
const { S3 } = pkg;

const endpoint = process.env.S3_ENDPOINT ?? "";
const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY ?? "";
const s3 = new S3({
  endpoint: endpoint,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const app = express();

// Serve static files from the 'assets' directory
// app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

app.get("/{*splat}", async (req, res) => {
  // id.100xdevs.com
  const host = req.hostname;

  const id = host.split(".")[0];
  //   const filePath = req.path;
  //   console.log(req.path);
  const filePath = req.path === "/" ? "/index.html" : req.path;
  console.log(`Fetching file for id: ${id}, path: ${filePath}`);

  const contents = await s3
    .getObject({
      Bucket: "jett",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  // Use mime-types to determine the correct content type
  const type = mime.lookup(filePath) || "application/octet-stream";
  // const type = filePath.endsWith("html")
  //   ? "text/html"
  //   : filePath.endsWith("css")
  //   ? "text/css"
  //   : "application/javascript";
  // res.set("Content-Type", type);
  res.setHeader("Content-Type", type);

  res.send(contents.Body);
});
app.listen(3001, () => {
  console.log("Request handler app listening on port 3001!");
});
