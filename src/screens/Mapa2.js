import React, { Component } from 'react';
import { TextInput, TouchableOpacity, ToastAndroid, StatusBar, Keyboard, StyleSheet, View, Text, Button, Dimensions, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Callout, AIzaSyCuxmTDA8SyV4PnEVjH6_9uzyVpK3pCfFU} from 'react-native-maps';
import { getRegion } from '../helpers/map';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import moment from 'moment';
import { ListItem } from 'react-native-elements'

export default class Mapa2 extends Component {
  constructor() {
    super();
    this.firestoreRef = firebase.firestore().collection('users');
    this.state = {
    location: {
      latitude: null,
      longitude: null
    },
    
    sendButtonActive: false,
    messages: [],
    uid: null,
    modalVisible: false,
    userArr: [],    
    name: '',
    email: '',
    mobile: '',
    greeting: '',
    isLoading: true,
    endereçoLugar: null,
    numeroLugar: null,
    nomeLugar: null
  }
}

  componentDidMount() {
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    this.getLocation();
   
    const currentUser = firebase.auth().currentUser;
    firebase.database()
    .ref('messages/')
    
    .on('child_added', (data) => {
      let messages = [...this.state.messages, data.val()];

      this.setState({ messages }, () => {
        let { latitude, longitude } = [...messages].pop();

        this.map.animateToRegion(getRegion(latitude, longitude, 16000));

        if (this.marker !== undefined) {
          setTimeout(() => {
            this.marker.showCallout();
          }, 100);
        }
      });
    });
    const dbRef = firebase.firestore().collection('users').doc(currentUser.uid)
    dbRef.get().then((res) => {
      if (res.exists) {
        const user = res.data();
        this.setState({
         
          email: user.email,
          
        });
      } else {
        console.log("Document does not exist!");
      }
    });
  }
  
  onChangenumeroLugar(numeroLugar) {
    this.setState({
      numeroLugar: numeroLugar,
      sendButtonActive: numeroLugar.length > 0
    });
  }
  onChangenomeLugar(nomeLugar) {
    this.setState({
      nomeLugar: nomeLugar,
      sendButtonActive: nomeLugar.length > 0
    });
  }
  onChangeendereçoLugar(endereçoLugar) {
    this.setState({
      endereçoLugar: endereçoLugar,
      sendButtonActive: endereçoLugar.length > 0
    });
  }
  onSendPress() {
    const currentUser = firebase.auth().currentUser;
    
    if (this.state.sendButtonActive) 
    
      firebase.database()
      .ref('messages/')
     
      .push({
        uid: currentUser.uid,
        nomeLugar: this.state.nomeLugar,
        endereçoLugar: this.state.endereçoLugar,
        numeroLugar: this.state.numeroLugar,
        latitude: this.state.location.latitude,
        longitude: this.state.location.longitude,        
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
      this.setState({ nomeLugar: null, numeroLugar:null, endereçoLugar: null });

      ToastAndroid.show('Your message has been sent!', ToastAndroid.SHORT);

        Keyboard.dismiss();
      }).catch((error) => {
        console.log(error);
      });
    
  }

  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});

      this.setState({
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      });

      this.map.animateToRegion(getRegion(location.coords.latitude, location.coords.longitude, 16000));
    }
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
    
  }
  getCollection = (querySnapshot) => {
    const userArr = [];
    querySnapshot.forEach((res) => {
      const { email } = res.data();
      var translated_ja = typeof res.data().translated === 'undefined' ? 'undefined' : res.data().translated.ja;
      userArr.push({
        key: res.id,
        res,
        
        email,
        translated_ja
      });
    });
    this.setState({
      userArr,
      isLoading: false,
   });
  }
  render() {
    const { navigation } = this.props;
    const { modalVisible } = this.state;
    return (
      <View style={styles.container}>
       
        <MapView
          ref={(ref) => this.map = ref}
          provider={AIzaSyCuxmTDA8SyV4PnEVjH6_9uzyVpK3pCfFU}
          style={styles.map}
          initialRegion={this.state.getLocation}
          showsUserLocation={true}
      showsCompass={true}
      mapType= 'hybrid'
      showsMyLocationButton= {true}
      showsPointsOfInterest= {true}
      showsBuildings= {true}
        >
          {this.state.messages.map((message, index) => {
            let { latitude, longitude, nomeLugar, timestamp } = message;

            return (
              <Marker
                ref={(ref) => this.marker = ref}
                key={index}
                identifier={'marker_' + index}
                coordinate={{ latitude, longitude }}
              >
                <Callout onPress={() => this.setModalVisible(true)}> 
                  <View>
                    <Text>{nomeLugar}</Text>
                    <Text style={{ 'color': '#999' }}>{moment(timestamp).fromNow()}</Text>                    
                  </View>                  
                </Callout>
              </Marker>
            )
          })}
           
        </MapView>
        <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text>{this.state.email}</Text>
            <View style={{ flex: 1, justifyContent: 'center', padding: 0, width:'100%', height:'100%' }}>
            {
            this.state.userArr.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  chevron
                  bottomDivider
                  title={item.email}
                  subtitle={item.email}
                  rightTitle={item.email}
                  rightSubtitle={item.translated_ja}
                  onPress={() => {
                    this.props.navigation.navigate('UserDetailScreen', {
                      userkey: item.key
                    });
                  }}/>
                  
              );
            })
          }
          </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Voltar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        
      </View>
        <Button style={styles.botao} mode="contained" onPress={() => navigation.navigate('Mapa1')}
      title= 'Voltar'>      
    </Button>
    <Button style={styles.botao} mode="contained" onPress={() => this.setModalVisible(true)}
      title= 'Add Marcador'>      
    </Button>
    <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nome do lugar XD"
            onChangeText={nomeLugar => this.onChangenomeLugar(nomeLugar)}
            value={this.state.nomeLugar}
          />
          <TextInput 
            style={styles.input}
            placeholder="Endereço do lugar XD"
            onChangeText={endereçoLugar => this.onChangeendereçoLugar(endereçoLugar)}
            value={this.state.endereçoLugar}
          />
           <TextInput
            style={styles.input}
            placeholder="Numero do lugar XD"
            onChangeText={numeroLugar => this.onChangenumeroLugar(numeroLugar)}
            value={this.state.numeroLugar}
          />
          <View style={{ ...styles.sendButton, ...(this.state.sendButtonActive ? styles.sendButtonActive : {}) }}>
            <TouchableOpacity onPress={this.onSendPress.bind(this)}>
              <MaterialIcons name="send" size={32} color="#fe4027" />
            </TouchableOpacity>
            <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Voltar</Text>
              </Pressable>
          </View>
        </View>
           
          </View>
             
            </View>
         
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute'
  },
  inputWrapper: {
    width: '100%',
    position: 'absolute',
    padding: 10,
    top: StatusBar.currentHeight,
    left: 0,
    zIndex: 100
  },
  input: {
    height: 46,
    paddingVertical: 10,
    paddingRight: 50,
    paddingLeft: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  sendButton: {
    position: 'absolute',
    top: 2,
    right: 20,
    opacity: 0.4
  },
  sendButtonActive: {
    opacity: 1
  },
  botao: {
    height: 60,
    paddingVertical: 10,
    paddingRight: 50,
    paddingLeft: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalView: {
    margin: 20,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    

  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});