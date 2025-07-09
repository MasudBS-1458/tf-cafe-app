import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  updateQuantity,
  clearCart
} from '../../redux/reducers/carts/cartsSlice';
import { RootState } from '../../redux/store';
import { TouchableOpacity, View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { totalQuantity, items, totalPrice } = useSelector((state: RootState) => state.carts);

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      handleRemove(id);
    }
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <View style={styles.emptyCartIcon}>
            <Icon name="shopping-cart" size={40} color="#ef4444" />
          </View>
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>Add some items to get started</Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {/* Cart Items Section */}
          <View style={styles.cartSection}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Your Cart ({totalQuantity})</Text>
              <TouchableOpacity
                onPress={() => dispatch(clearCart())}
                style={styles.clearAllButton}
                activeOpacity={0.7}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.itemsScrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {items.map(item => (
                <View key={item._id} style={styles.cartItem}>
                  <View style={styles.itemImageContainer}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.fallbackImage}>
                        <Icon name="shopping-bag" size={24} color="#9ca3af" />
                      </View>
                    )}
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTextContainer}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.itemPrice}>৳{item.price.toFixed(2)}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemove(item._id)}
                        activeOpacity={0.7}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash-o" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.quantityContainer}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item._id, item.quantity - 1)}
                          style={styles.quantityButton}
                          activeOpacity={0.7}
                        >
                          <Icon name="minus" size={14} color="#374151" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => handleQuantityChange(item._id, item.quantity + 1)}
                          style={styles.quantityButton}
                          activeOpacity={0.7}
                        >
                          <Icon name="plus" size={14} color="#374151" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.itemTotalPrice}>৳{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Order Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryDetails}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>৳{totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.freeShipping}>Free</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>৳0.00</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>৳{totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <Icon name="arrow-right" size={16} color="#ffffff" />
            </TouchableOpacity>

            {totalPrice < 500 && (
              <Text style={styles.shippingNote}>
                Add ৳{(500 - totalPrice).toFixed(2)} more to get free shipping
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  mainContainer: {
    flex: 1,
  },
  cartSection: {
    flex: 1,
    padding: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  clearAllButton: {
    padding: 8,
  },
  clearAllText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  itemsScrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  fallbackImage: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6b7280',
  },
  deleteButton: {
    padding: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginHorizontal: 8,
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryDetails: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
  },
  freeShipping: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalRow: {
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  checkoutButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  shippingNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default CartScreen;