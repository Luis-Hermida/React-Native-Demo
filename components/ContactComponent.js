import React, { Component } from "react";
import { Text, View } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import * as MailComposer from "expo-mail-composer";

class Contact extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: "Contact"
  };

  sendEmail() {
    console.log("A");
    MailComposer.composeAsync({
      recipients: ["confusion@food.net"],
      subject: "Enquiry",
      body: "To whom it may concern"
    });
  }

  contactInformation = [
    "121, Clear Water Bay Road",
    "Clear Water Bay, Kowloon",
    "HONG KONG",
    "Tel: +852 1234 5678",
    "Fax: +852 8765 4321",
    "Email:confusion@food.net"
  ];

  render() {
    return (
      <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
        <Card title="Contact Information">
          <View>
            {this.contactInformation.map((item, index) => {
              return (
                <Text key={index} style={{ paddingBottom: 10 }}>
                  {item}
                </Text>
              );
            })}
          </View>
          <View>
            <Button
              title="Send Email"
              buttonStyle={{ backgroundColor: "#512DA8" }}
              icon={
                <View style={{ marginRight: 15 }}>
                  <Icon name="envelope-o" type="font-awesome" color="white" />
                </View>
              }
              onPress={this.sendEmail}
            />
          </View>
        </Card>
      </Animatable.View>
    );
  }
}

export default Contact;
