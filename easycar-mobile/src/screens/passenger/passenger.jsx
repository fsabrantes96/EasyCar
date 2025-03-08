import { ActivityIndicator, Text, TextInput, View } from "react-native";
import MyButton from "../../components/mybutton/mybutton.jsx";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { styles } from "./passenger.style.js";
import { useEffect, useState } from "react";
import icons from "../../constants/icons.js"
import { getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from "expo-location";


function Passenger(props) {

    const user_id = 1; // id. do usuario logado no app (vem do login)
    const [myLocation, setMyLocation] = useState({});
    const [title, setTitle] = useState("");
    const [pickupAddress, setPickupAddress] = useState("");
    const [dropoffAddress, setDropoffAddress] = useState("");
    const [status, setStatus] = useState("");
    const [rideId, setRideId] = useState(0);
    const [driverName, setDriverName] = useState("");

    async function RequestRideFromUser(){
        // Acessa dados na API...

        //const response = {};

        /*const response = {
            ride_id: 1,
            passenger_user_id: 1,
            passenger_name: "Felipe Abrantes",
            passenger_phone: "(15) 15155-1515",
            pickup_address: "Est. Bairro Água Branca - Água Branca",
            pickup_date: "2025-02-21",
            pickup_latitude: "-23.252991",
            pickup_longitude: "-47.646411",
            dropoff_address: "Brooklyn Alamedas",
            status: "P",
            driver_user_id: null,
            driver_name: null,
            driver_phone: null
        }*/

            const response = {
                ride_id: 1,
                passenger_user_id: 1,
                passenger_name: "Felipe Abrantes",
                passenger_phone: "(15) 15155-1515",
                pickup_address: "Est. Bairro Água Branca - Água Branca",
                pickup_date: "2025-02-21",
                pickup_latitude: "-23.252991",
                pickup_longitude: "-47.646411",
                dropoff_address: "Brooklyn Alamedas",
                status: "A",
                driver_user_id: 2,
                driver_name: "Cristiano Ronaldo",
                driver_phone: "(15) 51511-5151"
            }

        return response;
    }

    async function RequestPermissuionAndGetLocation(){

        const {granted} = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync();

            if (currentPosition.coords)
                return currentPosition.coords;
            else
                return {};
        } else {
            return {};
        }

    }

    async function RequestAddressName(lat, long){
        const response = await reverseGeocodeAsync({
            latitude: lat,
            longitude: long
        });

        if (response[0].street && response[0].streetNumber && response[0].district) {
            setPickupAddress(response[0].street +  ", " +
                             response[0].streetNumber + " - " +
                             response[0].district);
        }
    }

    async function LoadScreen(){
        // buscar dados de corrida aberta na API para o usuário...
        const response = await RequestRideFromUser();

        if (!response.ride_id){

            const location = await RequestPermissuionAndGetLocation();

            if(location.latitude){
                setTitle("Encontre a sua carona agora");
                setMyLocation(location);
                RequestAddressName(location.latitude, location.longitude);
            } else {
                Alert.alert("Não foi possível obter sua localização");
            }

        } else {
            setTitle(response.status == "P" ? "Aguardando uma carona..." : "Carona Confirmada");
            setMyLocation({
                latitude: Number(response.pickup_latitude),
                longitude: Number(response.pickup_longitude)
            });
            setPickupAddress(response.pickup_address);
            setDropoffAddress(response.dropoff_address);
            setStatus(response.status);
            setRideId(response.ride_id);
            setDriverName(response.driver_name + " - " + response.driver_phone);
        }
    }

    async function AskForRide() {
        const json = {
            passenger_id: user_id,
            pickup_address: pickupAddress,
            dropoff_address: dropoffAddress,
            pickup_latitude: myLocation.latitude,
            pickup_longitude: myLocation.longitude
        }

        console.log("Fazer POST para o servidor: ", json);

        props.navigation.goBack();

    }

    async function CancelRide(){
        const json = {
            passenger_user_id: user_id,
            ride_id: rideId
        };

        console.log("Cancelar carona", json);

        props.navigation.goBack();
    }

    async function FinishRide() {
        const json = {
            passenger_user_id: user_id,
            ride_id: rideId
        };

        console.log("Finalizar carona", json);

        props.navigation.goBack();
    }

    useEffect(() => {
        LoadScreen();
    }, []);

    return <View style={styles.container}>

        {
        myLocation.latitude ? <>
            <MapView style={styles.map} 
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004
                }}
        >
        <Marker coordinate={{
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
        }}
            title="Felipe Abrantes"
            description="Praça da Sé"
            image={icons.location}
            style={styles.marker}/>
        </MapView>
        <View style={styles.footer}>
        <View style={styles.footerText}>
                <Text>{title}</Text>
            </View>

            <View style={styles.footerFields}>
                <Text>Origem</Text>
                <TextInput style={styles.input} value={pickupAddress}
                onChangeText={(text) => setPickupAddress(text)}
                editable={status == "" ? true : false} />
            </View>

            <View style={styles.footerFields}>
                <Text>Destino</Text>
                <TextInput style={styles.input} value={dropoffAddress}
                onChangeText={(text) => setDropoffAddress(text)}
                editable={status == "" ? true : false}/>
            </View>

            {
                status == "A" && <View style={styles.footerFields}>
                    <Text>Motorista</Text>
                    <TextInput style={styles.input} value={driverName}
                        editable={false} />
                </View>
            }

        </View>
        {status == "" && <MyButton text="CONFIRMAR" theme="default"
        onClick={AskForRide} />}

        {status == "P" && <MyButton text="CANCELAR" theme="red"
        onClick={CancelRide} />}

        {status == "A" && <MyButton text="FINALIZAR CARONA" theme="red"
        onClick={FinishRide} />}
    </> 
        
        : <View style={styles.loading}>
            <ActivityIndicator size="large" />
        </View>
        }

        
    </View>
}

export default Passenger;