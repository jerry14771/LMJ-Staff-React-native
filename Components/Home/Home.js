import { View, Text, TouchableOpacity, TextInput,StyleSheet, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import config from '../../config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';


const Home = () => {
  const navigation = useNavigation();
  const nameLogo = require('../../assets/driving_license.png');
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const pricelist = require('../../assets/price_list.png');

  useFocusEffect(
    React.useCallback(() => {
      checkuserAuthAccess();
      checktodaysdata();

      return () => {
      checkuserAuthAccess();
      checktodaysdata();
    };
    }, [])
  );

  const checkuserAuthAccess = async () => {
    const response = await fetch(config.BASE_URL + 'checkUserAccess.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(),
    });
    const result = await response.json();
    if(result.code == '400'){
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    });

    }
  }
  const checktodaysdata = async () => {
    const url = `${config.BASE_URL}todaysDelivery.php`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(),
        });
        const result = await response.json();
        if (result.status == "success") {
            setData(result.data);
            setFilteredData(result.data);
        }
  }


  const TriangleCorner = ({ text }) => {
    return (
        <View style={styles.ribbonContainer}>
            <View style={styles.triangleCorner} />
            <Text style={styles.ribbonText}>{text}</Text>
        </View>
    );
};





  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('InvoiceDetail', { invoice: item })} style={{ margin: 10 }}>
        <View style={styles.card}>
            <TriangleCorner text={item.invoice_number} />
            <Image source={pricelist} style={styles.image} />
            <View style={{ flexShrink: 1, width:"100%"}}>
                <Text style={styles.nameText}>
                    Name: <Text style={styles.boldText}>{item.name}</Text>
                </Text>
                <Text style={styles.amountText}>
                    Billing Amount: <Text style={styles.boldAmountText}>₹{item.totalAmount}</Text>
                </Text>
                <Text style={styles.amountText}>
                    Paid Amount: <Text style={styles.boldAmountText}>₹{item.amountGiven}</Text>
                </Text>
                <View style={{ flexDirection:"row", gap:10}}>
                    <Text style={styles.mobileText}>Status: </Text>
                    <Text style={{ padding:5, backgroundColor:item.status=="Completed" ?'#32CD32': item.status=="Pending"? "#FFA500":item.status=="Ongoing"?'#1E90FF':'#FFD700', borderRadius:5, color:"white", fontWeight:"600"}}>{item.status}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);


  return (
    <View>
      <Header/>
      {/* <TextInput placeholder='Search' style={{ borderColor:"black", borderWidth:1, marginTop:5, marginHorizontal:5, borderRadius:5, fontSize:18, padding:5, color:"black", fontWeight:"600", paddingLeft:15}} /> */}
      <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => navigation.navigate("ListAllOrder")}
                >
                    <Image source={nameLogo} style={styles.buttonImage} />
                    <Text style={styles.buttonText}>List All Orders (Filters)</Text>
                </TouchableOpacity>

                <View>
                    <View>
                        <View style={{ backgroundColor:"black", padding:5, margin:5, alignItems:"center", borderRadius:5}}>
                            <Text style={{ color:"white", fontSize:18, fontWeight:"600" }}>Today's Delivery</Text>
                        </View>
                    </View>
                    <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
                </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  buttonContainer: {
      flexDirection: "row",
      width: "100%",
      alignSelf: "center",
      marginTop: 20,
      justifyContent: 'space-evenly',
  },
  touchable: {
    //   width: "100%",
      backgroundColor: "white",
      padding: 10,
      borderRadius: 5,
      shadowColor: "red",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 5,
      alignItems: "center",
      height:130,
      justifyContent:"center",
      marginTop:10,
      margin:5
  },
  buttonImage: {
      height: 60,
      width: 60,
  },
  buttonText: {
      textAlign: "center",
      color: "black",
      fontSize:18,
      fontWeight:"600"
  },
  titleContainer: {
      margin: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      borderRadius: 5,
      padding: 5,
  },
  titleText: {
      fontSize: 18,
      color: "black",
      fontWeight: "600",
  },
  card: {
      backgroundColor: "white",
      marginVertical: 5,
      flexDirection: "row",
      padding: 12,
      borderRadius: 8,
      shadowColor: "red",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      alignItems: "center",
      position: 'relative',
  },
  image: {
      height: 80,
      width: 80,
      borderRadius: 8,
      marginRight: 12,
  },
  nameText: {
      color: "#333",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
  },
  boldText: {
      color: "#555",
      fontSize: 16,
      fontWeight: "700",
  },
  amountText: {
      color: "#333",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
  },
  boldAmountText: {
      color: "#2a9d8f",
      fontSize: 16,
      fontWeight: "700",
  },
  mobileText: {
      color: "#333",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
      fontSize:18
  },
  boldMobileText: {
      color: "#555",
      fontSize: 16,
      fontWeight: "500",
  },
  ribbonContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      alignItems: 'center',
      zIndex: 1,
  },
  triangleCorner: {
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid",
      borderRightWidth: 80, // adjust for size
      borderTopWidth: 60, // adjust for size
      borderRightColor: "transparent",
      borderTopColor: "red", // change to your desired color
  },
  ribbonText: {
      position: 'absolute',
      left: 5, // adjust to position the text properly
      top: 5, // adjust to position the text properly
      fontSize: 15,
      color: '#fff', // white text for visibility
      fontWeight: 'bold',
      textAlign: 'center',
  },
});

export default Home