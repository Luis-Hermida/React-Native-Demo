import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Picker,
  Switch,
  Button,
  Alert,
  Platform
} from "react-native";
import { Card } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import DatePicker from "react-native-datepicker";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";
var moment = require("moment");

class Reservation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guests: 1,
      smoking: false,
      date: ""
    };
  }

  static navigationOptions = {
    title: "Reserve Table"
  };

  handleReservation() {
    Alert.alert(
      "Your Reservation",
      "Number of Guests: " +
        this.state.guests +
        "\n" +
        "Smoking: " +
        this.state.smoking +
        "\n" +
        "Date and Time: " +
        this.state.date +
        "\n",
      [
        {
          text: "Cancel",
          onPress: () => {
            this.setState({
              guests: 1,
              smoking: false,
              date: ""
            });
          }
        },
        {
          text: "OK",
          onPress: () => {
            this.presentLocalNotification(this.state.date);
            this.addReservationToCalendar(this.state.date);
          }
        }
      ],
      { cancelable: false }
    );
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: ""
    });
  }

  async obtainCalendarPermission() {
    console.log("Obtain Calendar Permission");
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      console.log("Calendar granted");
    } else {
      console.log("Calendar denied");
    }
  }

  async addReservationToCalendar(date) {
    await this.obtainCalendarPermission();
    const startDate = new Date(Date.parse(date));
    const endDate = new Date(Date.parse(date) + 2 * 60 * 60 * 1000); // 2 hours
    Calendar.createEventAsync(Calendar.DEFAULT, {
      title: "Con Fusion Table Reservation",
      startDate,
      endDate,
      location:
        "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong",
      timeZone: "Asia/Hong_Kong"
    });
  }

  async obtainNotificationPermission() {
    let permission = await Permissions.getAsync(
      Permissions.USER_FACING_NOTIFICATIONS
    );
    if (permission.status !== "granted") {
      permission = await Permissions.askAsync(
        Permissions.USER_FACING_NOTIFICATIONS
      );
      if (permission.status !== "granted") {
        Alert.alert("Permission not granted to show notification");
      }
    }
    return permission;
  }

  async presentLocalNotification(date) {
    await this.obtainNotificationPermission();
    Notifications.presentLocalNotificationAsync({
      title: "Your Reservation",
      body:
        "Reservation for " +
        moment(date).format("MMM Do YYYY, h:mm:ss a") +
        " requested",
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true,
        color: "#512DA8"
      }
    });
  }

  render() {
    return (
      <ScrollView>
        <Animatable.View animation="zoomInUp" duration={2000} delay={1000}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Number of Guests</Text>
            <Picker
              style={styles.formItem}
              selectedValue={this.state.guests}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ guests: itemValue })
              }
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
            <Switch
              style={styles.formItem}
              value={this.state.smoking}
              onTintColor="#512DA8"
              onValueChange={value => this.setState({ smoking: value })}
            ></Switch>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date and Time</Text>
            <DatePicker
              style={{ flex: 2, marginRight: 20 }}
              date={this.state.date}
              format=""
              mode="datetime"
              placeholder="Select date and time"
              minDate="2017-01-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={date => {
                this.setState({ date: date });
              }}
            />
          </View>
          <View style={styles.formRow}>
            <Button
              onPress={() => this.handleReservation()}
              title="Reserve"
              color="#512DA8"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  }
});

export default Reservation;
