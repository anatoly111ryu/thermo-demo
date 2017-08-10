import React from 'react';
import { Fingerprint } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';

export default class FingerprintWaitingNotification extends React.Component {
  state = {
    hasFingerprintAuth: false
  };

  componentDidMount() {
    Fingerprint.hasHardwareAsync().then(hasHardware => {
      hasHardware &&
        Fingerprint.isEnrolledAsync().then(hasFingerprintAuth => {
          this.setState({ hasFingerprintAuth });
          this.authFunction();
        });
    });
  }

  authFunction = async () => {
    try {
      let result =
        Platform.OS === 'ios'
          ? await Fingerprint.authenticateAsync('Show me your finger')
          : await Fingerprint.authenticateAsync();

      if (result.success) {
        this.props.onFingerprintSuccess();
      } else {
        this.setState({ hasFingerprintAuth: false });
        console.log('Fingerprint Auth Failed', result);
      }
    } catch (err) {
      console.error('authFunction Error', err);
    }
  };

  render() {
    return (
      <View style={{ padding: 10 }}>
        {this.state.hasFingerprintAuth
          ? <View style={{ flexDirection: 'row' }}>
              <Ionicons name="md-finger-print" size={25} color="white" />
              <Text style={{ fontSize: 20, color: 'white', paddingLeft: 10 }}>
                Waiting for fingerprint...
              </Text>
            </View>
          : null}
      </View>
    );
  }
}
