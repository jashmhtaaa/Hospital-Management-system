import { CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,

  View,
} from 'react-native';

interface Payment {
  billId: string,
  currency: string,
}

const MobilePaymentScreen: React.FC<{ payment: Payment }> = ({ payment }) => {
  const [loading,
  const [clientSecret, setClientSecret] = useState('');
  const [cardDetails, setCardDetails] = useState(null);

  const { confirmPayment } = useConfirmPayment();

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billId: payment.billId,
          currency: payment.currency
        })
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) { console.error(error); }
  };

  const handlePayment = async () => {
    if (!cardDetails?.complete || !clientSecret) {
      Alert./* SECURITY: Console statement removed */
      return
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: 'patient@example.com', // Should come from user data
          },
        },
      });

      if (error != null) {
        Alert./* SECURITY: Console statement removed */
      } else if (paymentIntent != null) {
        Alert./* SECURITY: Console statement removed */
        // Navigate back or show success screen
      }
    } catch (error) { console.error(error); } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>

      <View style={styles.paymentInfo}>
        <Text style={styles.amount}>
          {payment.currency} {payment.amount.toFixed(2)}
        </Text>
        <Text style={styles.description}>{payment.description}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Card Information</Text>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: '4242 4242 4242 4242'
          }}
          cardStyle={styles.card}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={loading || !cardDetails?.complete}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>
            Pay {payment.currency} {payment.amount.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.securityInfo}>
        <Text style={styles.securityText}>
          🔒 Your payment is secured with 256-bit SSL encryption
        </Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: '#333'
  },
  paymentInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',width: 0, height: 2 ,
    shadowOpacity: 0.1,
    elevation: 3
  },
  amount: {
    fontSize: 32,
    color: '#007AFF',
    marginBottom: 5
  },
  description: {
    fontSize: 16,
    textAlign: 'center'
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: width: 0, height: 2 ,
    shadowOpacity: 0.1,
    elevation: 3
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333'
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000'
  },
  cardField: {
    width: '100%',
    marginVertical: 30
  },
  payButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    marginBottom: 20
  },
  payButtonDisabled: {
    backgroundColor: '#ccc'
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  securityInfo: {
    alignItems: 'center',
    marginTop: 20
  },
  securityText: {
    fontSize: 12,
    textAlign: 'center'
  },

export default MobilePaymentScreen;
