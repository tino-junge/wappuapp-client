'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import theme from '../style/theme';
import analytics from '../services/analytics';

import TabBarItems from '../components/tabs/Tabs';
import CalendarView from '../components/calendar/TimelineList';
import MapView from '../components/map/EventMap';

const ScrollTabs = require('react-native-scrollable-tab-view');

const VIEW_NAME = 'EventsView';

class EventsView extends Component {

  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  }

  render() {

    return (
      <View style={{flexGrow: 1,}}>
        <ScrollTabs
          initialPage={0}
          tabBarActiveTextColor={theme.secondary}
          tabBarUnderlineColor={theme.secondary}
          tabBarBackgroundColor={theme.white}
          tabBarInactiveTextColor={'rgba(0,0,0,0.6)'}
          renderTabBar={() => <TabBarItems />}
        >
          <CalendarView
            tabLabel="Calendar"
            navigator={this.props.navigator}
            barColor={theme.accent}
            ref="calendar" />
          <MapView
            tabLabel="Map"
            navigator={this.props.navigator}
            barColor={theme.positive}
            ref="map" />
      </ScrollTabs>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: theme.white
  }
});

export default EventsView;