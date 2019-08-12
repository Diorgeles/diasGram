import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image
} from "react-native";
import api from "~/services/api";
import io from "socket.io-client";

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 20 }}
        onPress={() => navigation.navigate("New")}
      >
        <Text>Add</Text>
      </TouchableOpacity>
    )
  });

  state = {
    feed: []
  };

  async componentDidMount() {
    this.registerToSocker();

    try {
      const response = await api.get("posts");
      console.log(response.data);

      this.setState({ feed: response.data });
    } catch (error) {
      console.log("TCL: componentDidMount -> error", error);
    }
  }
  registerToSocker = () => {
    const socket = io("http://192.168.0.3:3333");

    socket.on("post", newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on("like", likedPost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === likedPost._id ? likedPost : post
        )
      });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.author}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>

                <Image
                  style={styles.feedImage}
                  source={{
                    uri: `http://192.168.0.3:3333/files/${item.image}`
                  }}
                />
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  feedItem: {
    marginTop: 20
  },
  feedItemHeader: {
    paddingHorizontal: 15
  },
  name: {
    fontSize: 14,
    color: "#000"
  },
  place: {
    fontSize: 12,
    color: "#666",
    marginTop: 2
  },
  feedImage: {
    width: "100%",
    height: 400,
    marginVertical: 15
  }
});
