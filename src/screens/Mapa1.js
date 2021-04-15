import React, { Component } from 'react';
import { TextInput, ScrollView, TouchableOpacity, ToastAndroid, StatusBar, Keyboard, StyleSheet, View, Text, Button, Dimensions, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Callout, AIzaSyCuxmTDA8SyV4PnEVjH6_9uzyVpK3pCfFU} from 'react-native-maps';
import { getRegion } from '../helpers/map';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import moment from 'moment';
import { ListItem } from 'react-native-elements'

export default class Mapa1 extends Component {
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
    nomeLugar: null,
    emailUser: null
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
    
    firebase.database()
    .ref('messages/')
    
  
    .on('value', snapshot => {
     console.log('User data: ', snapshot.val());
    });

  }
  
  componentWillUnmount(){
    this.unsubscribe();
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
        userArr.push({
        key: res.id,
        res,
        
        email,
 
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
            let { latitude, longitude, nomeLugar, timestamp, endereçoLugar } = message;

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
          })
          
          }
        
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
          
            
            <ScrollView style={styles.container2}>
          {
            this.state.userArr.map((item, i) => {
              return (
                <ListItem
                style={{ backgroundColor:'black' }}
                  key={i}
                  chevron
                  bottomDivider
                  title={item.email}              
                  subtitle={item.email}>
                   <Text>
                   {item.email}
                   </Text>
                   </ListItem>
              );
            })
          }
      </ScrollView>
            <View style={{ flex: 1, justifyContent: 'center', padding: 0, width:'100%', height:'100%' }}>
           
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
          
        <Button style={styles.botao} mode="contained" onPress={() => navigation.navigate('Mapa2')}
      title= 'Avançar'>      
    </Button>
 
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
  },
  container2: {
    flex: 1,
    paddingBottom: 22
   },
   preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
});