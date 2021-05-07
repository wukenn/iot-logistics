import * as cdk from "monocdk";

import { Stream } from "monocdk/aws-kinesis";
import { CfnTopicRule } from "monocdk/aws-iot";
import { Role, ServicePrincipal, ManagedPolicy } from "monocdk/lib/aws-iam";

export class IotLogisticsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const kinesisStream = new Stream(this, "iot-logistics-stream", {
      streamName: "iot-logistics-stream",
      shardCount: 1,
    });

    const kinesisRole = new Role(this, "kinesisRole", {
      assumedBy: new ServicePrincipal("iot.amazonaws.com"),
      roleName: "kinesisRole",
    });

    kinesisRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonKinesisFullAccess")
    );

    // Create the iot rule that puts the data into kinesis
    const iotRule = new CfnTopicRule(this, "IotCoreToKinesisRule", {
      topicRulePayload: {
        description: "This iot rule forwards message to kinesis dat astreams",
        actions: [
          {
            kinesis: {
              roleArn: kinesisRole.roleArn,
              streamName: "iot-logistics-stream",
            },
          },
        ],
        ruleDisabled: false,
        sql: "SELECT * from vehicleTopic/#",
        awsIotSqlVersion: "2016-03-23",
      },
    });
  }
}
