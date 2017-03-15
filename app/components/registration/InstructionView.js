'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView
} from 'react-native';
import theme from '../../style/theme';
import Toolbar from './RegistrationToolbar';
import Button from '../../components/common/Button';
import Row from '../../components/common/Row';
import Icon from 'react-native-vector-icons/Ionicons';

const IOS = Platform.OS === 'ios';

class InstructionView extends Component {
  render() {
    const { simplified } = this.props;
    const containerStyles = [styles.container, styles.modalBackgroundStyle, simplified && styles.simplified];

    return (
      <View style={containerStyles}>
        {!simplified && <Toolbar icon={null} iconClick={() => null} title='Introduction' />}
          <ScrollView style={{flex:1, width: null, height: null}}>
            <View style={[styles.container, styles.contentContainer]}>
              <Text style={styles.header}>
                How to Whappu
              </Text>

              <Row
                style={{paddingTop: 30}}
                icon={IOS ? 'ios-star': 'md-star'}
                title={'1. Earn points'}
                text={'Guild with most Whappu points wins a juicy prize!'}/>

              <Row
                icon={IOS ? 'ios-wine' : 'md-wine'}
                title={'2. Enjoy sima'}
                text={'Because otherwise you might get thirsty.'}/>

              <Row
                icon={IOS ? 'ios-happy' : 'md-happy'}
                title={'3. Show the love'}
                text={'Remember also to log your daily Whappumood!'}/>

              <Row
                icon={IOS ? 'ios-trophy' : 'md-trophy'}
                title={'4. Winner takes it all'}
                text={'Competition ends at 12:00AM on 1st of May.'}
                secondaryText={'Winner will be announced later on the day.'}/>
            </View>
          </ScrollView>

        {!simplified &&
          <View style={styles.bottomButtons}>
            <Button onPress={this.props.onDismiss} style={styles.modalButton}>
              Got it
            </Button>
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30
  },
  simplified: {
    marginBottom: 40,
    alignSelf: 'stretch'
  },
  innerContainer: {
    flex: 1,
    paddingTop: IOS ? 15 : 15,
  },
  header: {
    fontWeight: 'bold',
    color: theme.secondary,
    marginTop: 30,
    marginLeft: IOS ? 25 : 15,
    fontSize: 28
  },
  bottomButtons:{
    flex:1,
    flexDirection:'column',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height:50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
  }
});

export default InstructionView;
