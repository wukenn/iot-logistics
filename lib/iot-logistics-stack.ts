import * as cdk from '@aws-cdk/core';
import * as kinesis from '@aws-cdk/aws-kinesis'
export class IotLogisticsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new kinesis.Stream(this, "MyFirstStream", {
      streamName: "my-awesome-stream",
      shardCount: 1,
    });
  }
}
