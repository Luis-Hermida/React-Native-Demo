import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Button,
  Modal,
  StyleSheet,
  Alert,
  PanResponder,
  Share
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import * as Animatable from "react-native-animatable";
import { postFavorite, postComment } from "../redux/ActionCreators";
import { baseUrl } from "../assets/js/baseUrl";
var moment = require("moment");

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment, date) =>
    dispatch(postComment(dishId, rating, author, comment, date))
});

const RenderDish = props => {
  const dish = props.dish;

  var viewRef;
  const handleViewRef = ref => (viewRef = ref);

  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    if (dx < -200) {
      return true;
    } else {
      return false;
    }
  };

  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    if (dx < 300) {
      return true;
    } else {
      return false;
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true;
    },
    onPanResponderGrant: () => {
      viewRef.rubberBand(1000);
    },
    onPanResponderEnd: (e, gestureState) => {
      if (recognizeDrag(gestureState)) {
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + dish.name + " to favorite?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => {
                props.favorite
                  ? console.log("Already favorite")
                  : props.onPress();
              }
            }
          ],
          { cancelable: false }
        );
      } else if (recognizeComment(gestureState)) {
        console.log(333);
        props.onShowModal();
      } else {
        return true;
      }
    }
  });

  const shareDish = (title, message, url) => {
    Share.share(
      {
        title: title,
        message: title + ": " + message + " " + url,
        url: url
      },
      {
        dialogTitle: "Share " + title
      }
    );
  };

  if (dish != null) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        ref={handleViewRef}
        {...panResponder.panHandlers}
      >
        <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View
            style={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <Icon
              raised
              reverse
              name={props.favorite ? "heart" : "heart-o"}
              type="font-awesome"
              color="#f50"
              onPress={() =>
                props.favorite
                  ? console.log("Already favorite")
                  : props.onFavorite()
              }
            />
            <Icon
              raised
              reverse
              name="pencil"
              type="font-awesome"
              color="#512DA8"
              onPress={() => props.onShowModal()}
            />
            <Icon
              raised
              reverse
              name="share"
              type="font-awesome"
              color="#51D2A8"
              onPress={() =>
                shareDish(dish.name, dish.description, baseUrl + dish.image)
              }
            />
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View></View>;
  }
};

const RenderDishComments = props => {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            flexDirection: "row"
          }}
        >
          <Rating imageSize={15} readonly startingValue={item.rating} />
        </View>
        <Text style={{ fontSize: 12 }}>
          {"-- " +
            item.author +
            ", " +
            moment(item.date).format("MMM Do YYYY, h:mm:ss a")}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
};

class DishDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFormModal: false,
      rating: 5,
      author: "",
      comment: ""
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleFormModal() {
    this.setState({ showFormModal: !this.state.showFormModal });
  }

  handleSumbit(dishId) {
    const currentDate = new Date();
    this.props.postComment(
      dishId,
      this.state.rating,
      this.state.author,
      this.state.comment,
      currentDate.toISOString()
    );
    this.resetForm();
    this.toggleFormModal();
  }

  resetForm() {
    this.setState({
      rating: 5,
      author: "Luis",
      comment: ""
    });
  }

  static navigationOptions = {
    title: "Dish Details"
  };

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");

    const RenderFormModal = props => {
      if (props.showFormModal) {
        return (
          <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.showFormModal}
            onDismiss={() => this.toggleFormModal()}
            onRequestClose={() => this.toggleFormModal()}
          >
            <View style={styles.modal}>
              <Rating
                showRating
                style={{ paddingVertical: 10 }}
                startingValue={this.state.rating}
                onFinishRating={value => {
                  this.setState({ rating: value });
                }}
              />
              <View style={styles.formRow}>
                <Input
                  placeholder="Author"
                  leftIcon={
                    <View style={{ marginRight: 16 }}>
                      <Icon name="user-o" type="font-awesome" size={24} />
                    </View>
                  }
                  onChangeText={author => this.setState({ author })}
                />
              </View>
              <View style={styles.formRow}>
                <Input
                  placeholder="Comment"
                  leftIcon={
                    <View style={{ marginRight: 16 }}>
                      <Icon name="comment-o" type="font-awesome" size={24} />
                    </View>
                  }
                  onChangeText={comment => this.setState({ comment })}
                />
              </View>
              <View style={styles.formRow}>
                <Button
                  onPress={() => {
                    this.handleSumbit(dishId);
                  }}
                  color="#512DA8"
                  title="Submit"
                />
              </View>
              <View style={styles.formRow}>
                <Button
                  onPress={() => {
                    this.toggleFormModal();
                    this.resetForm();
                  }}
                  color="#555"
                  title="Close"
                />
              </View>
            </View>
          </Modal>
        );
      } else {
        return <View></View>;
      }
    };

    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onFavorite={() => this.markFavorite(dishId)}
          onShowModal={() => this.toggleFormModal()}
        />
        <RenderDishComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
        <RenderFormModal showFormModal={this.state.showFormModal} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    marginBottom: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  modal: {
    justifyContent: "center",
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#512DA8",
    textAlign: "center",
    color: "white",
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
