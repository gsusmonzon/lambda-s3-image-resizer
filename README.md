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

So you need Serverless to be installed and configured. So you may need to install the,

```shell
# npm install serverless-plugin-include-dependencies serverless-plugin-common-excludes --save-dev
yarn add --dev serverless-plugin-include-dependencies serverless-plugin-common-excludes
```

Since Sharp library has native extension, You need to deploy from Linux. Otherwise read <https://sharp.pixelplumbing.com/install#aws-lambda>


Credits
----------------

based on <https://github.com/serverless/examples/tree/master/aws-node-dynamic-image-resize> but simpler.
