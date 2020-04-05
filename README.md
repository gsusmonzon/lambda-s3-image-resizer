# AWS Lambda Image Resizer in S3

Example of a Image resizer using AWS lambda and S3

This is a node implementation of an image resizer while a I took the [AWS Lambda and the Serverless Framework](https://www.udemy.com/course-dashboard-redirect/?course_id=1241098) course.

This is an interesting exercise since it uses a 'native' library for image resizing: [Sharp](https://sharp.pixelplumbing.com/install#aws-lambda)


```
 +--------+                  +----------+                 +--------+
 |        |                  |          |                 |        |
 |   S3   | +--------------> |  Lambda  | +-------------> |   S3   |
 |        |      trigger     |          |     push        |        |
 +--------+                  +----------+                 +--------+

 new image                    creates a                    new thumbnail
 uploaded                     thumbnail                    created
```


Deploy
---------------

The deploy is done using the [Serverless Framework](https://sharp.pixelplumbing.com/install#aws-lambda) .

```shell
sls deploy -v
```

You need Serverless to be installed and configured. Additionally you may need to install some [plugins for size reduction](https://serverless.com/plugins/serverless-plugin-include-dependencies/),

```shell
# npm install serverless-plugin-include-dependencies serverless-plugin-common-excludes --save-dev
yarn add --dev serverless-plugin-include-dependencies serverless-plugin-common-excludes
```

Since Sharp library has native extensions, you need Linux binaries when deploying (AWS runs on linux).
If your **local machine runs Linux** your are fine.
Otherwise read <https://sharp.pixelplumbing.com/install#aws-lambda>


Credits
----------------

based on <https://github.com/serverless/examples/tree/master/aws-node-dynamic-image-resize> but simpler.
