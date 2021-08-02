import * as React from 'react';
import RNBootSplash from "react-native-bootsplash";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  Platform
  } from 'react-native';
import { getQuotes } from './api';
const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;


const Loading = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.paragraph}>Loading . . . connect to internet .</Text>
  </View>
);


function App ()  {
  const [quotes, setQuotes] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    setTimeout(()=>{
      RNBootSplash.hide({ fade : true });
    },3700)
    const fetchData = async () => {
      const quotes = await getQuotes();
      setQuotes([{ id: 'empty-left' }, ...quotes, { id: 'empty-right' }]);
    };

    if (quotes.length === 0) {
      fetchData(quotes);
    }
  }, [quotes]);

  if (quotes.length === 0) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      <Text style={styles.headerText}>Mr. Robot</Text>

      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={quotes}
        keyExtractor={(item) => item.id}
        horizontal
        bounces={false}
        decelerationRate={0}
        initialNumToRender={10}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.pic) {
            return <View style={{ width: EMPTY_ITEM_SIZE, backgroundColor: '#FB0B0B' }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 0 , 100],
            extrapolate: 'clamp',
          });

          return (
            <View style={styles.flatCardOuter}>
              <Animated.View style={{height:'86%',
               marginHorizontal: SPACING,
                padding: SPACING * 2,
                 alignItems: 'center',
                 transform: [{ translateY }],
                  backgroundColor: '#302525',
                   borderRadius: 34}}>
                <Image
                  source={{uri:item.pic}}
                  style={styles.posterImage}
                />
                <Text style={styles.quoteStyle}>
                  {item.quote}
                </Text>
                <Text style={styles.speakerStyle} numberOfLines={1}>
                  -    {item.speaker}
                </Text> 
              </Animated.View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
export default React.memo(App);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'black'
  },
  container: {
    flex: 1,
    backgroundColor:'black',
    marginTop:0,
  },
  headerText:{
    color:'#FB0B0B',
    fontFamily:'MrRobot',
    marginTop: Platform.OS == 'android' ? 24 : 35,
    textAlign:'center',
    fontSize:25,
  },
  flatCardOuter:{
    width: ITEM_SIZE,
    
  },
  
  posterImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 50,
    margin: 0,
    marginBottom: 10,
  },
  quoteStyle: {
    fontSize: 15,
    color:'#FB0B0B',
    overflow:'scroll',
    fontFamily:'MrRobot',
    paddingTop:'5%'
  },
  speakerStyle:{
    fontSize: 12,
    color:'red',
    fontFamily:'MrRobot',
    marginTop:10
  },
  paragraph:{
    color:'red',
    fontFamily:"MrRobot",
    fontSize:20,
    textAlign:'center'
  }
});