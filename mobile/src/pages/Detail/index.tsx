import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native'
import { Feather as Icon, FontAwesome as FA } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'
import Constants from 'expo-constants'
import api from '../../services/api'

interface Params {
  point_id: number 
}

interface Data {
  foundedPoint: {
    image: string
    name: string
    email: string
    whatsapp: string
    city: string
    uf: string
  }
  items: {
    title: string
  }[]
}

const Detail = () => {

  const navigation = useNavigation()
  const route = useRoute()
  const routeParams = route.params as Params

  const [data, setData] = useState<Data>({} as Data)
  
  function handleNavigationBackHome() {
    navigation.goBack()
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse em coleta de resíduos',
      recipients: [data.foundedPoint.email]
    })
  }

  function handleWhatsApp() {
    Linking.openURL(`whatsapp://send?phone=${data.foundedPoint.whatsapp}&&text=Tenho interesse em saber mais sobre a coleta de resíduos`)
  }

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data)
    })
  }, [])

  if(!data.foundedPoint) {
    return null
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container} >
        <TouchableOpacity onPress={handleNavigationBackHome}>
            <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image source={{uri: data.foundedPoint.image}} style={styles.pointImage} />

        <Text style={styles.pointName}>
          {data.foundedPoint.name}
        </Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle} >Endereço</Text>
          <Text style={styles.addressContent} > {data.foundedPoint.city} - {data.foundedPoint.uf} </Text>
        </View>
      </View>

      <View style={styles.footer} >
        <RectButton style={styles.button} onPress={handleWhatsApp}>
            <FA name="whatsapp" color="#FFF" size={20}/>
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
            <Icon name="mail" color="#FFF" size={20}/>
            <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Detail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});