import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useGetFoodsQuery } from '../../redux/reducers/foods/foodApi';
import { setFilters } from '../../redux/reducers/foods/foodSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';

const PRICE_RANGE_STEPS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

const FoodScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.foods.filters);
  const [localPriceRange, setLocalPriceRange] = useState([filters.minPrice, filters.maxPrice]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // RTK Query to fetch foods
  const { data: foods = [], isLoading, isError, error } = useGetFoodsQuery(filters);

  const categories = ['All Categories', ...new Set(foods.map(food => food.category))];

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({
      ...filters,
      category: category === 'All Categories' ? '' : category
    }));
  };

  const handlePriceChange = (price: number, isMin: boolean) => {
    const newRange = isMin
      ? [price, localPriceRange[1]]
      : [localPriceRange[0], price];

    setLocalPriceRange(newRange);
    dispatch(setFilters({
      ...filters,
      minPrice: newRange[0],
      maxPrice: newRange[1]
    }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      sortBy: ""
    };
    dispatch(setFilters(defaultFilters));
    setLocalPriceRange([defaultFilters.minPrice, defaultFilters.maxPrice]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error: {(error as any)?.data?.message || 'Failed to fetch foods'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filters</Text>

        {(filters.category || filters.minPrice !== 0 || filters.maxPrice !== 1000) && (
          <TouchableOpacity onPress={resetFilters} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear all</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => handleCategoryChange(category)}
              style={[
                styles.categoryButton,
                (filters.category === category ||
                  (category === 'All Categories' && !filters.category)) && styles.selectedCategory
              ]}
            >
              <Text style={[
                styles.categoryText,
                (filters.category === category ||
                  (category === 'All Categories' && !filters.category)) && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Minimum Price</Text>
        <FlatList
          horizontal
          data={PRICE_RANGE_STEPS}
          keyExtractor={(item) => item.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceListContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePriceChange(item, true)}
              style={[
                styles.priceButton,
                localPriceRange[0] === item && styles.selectedPriceButton
              ]}
            >
              <Text style={[
                styles.priceText,
                localPriceRange[0] === item && styles.selectedPriceText
              ]}>
                ৳{item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.sectionTitle}>Maximum Price</Text>
        <FlatList
          horizontal
          data={PRICE_RANGE_STEPS}
          keyExtractor={(item) => item.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceListContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePriceChange(item, false)}
              style={[
                styles.priceButton,
                localPriceRange[1] === item && styles.selectedPriceButton
              ]}
            >
              <Text style={[
                styles.priceText,
                localPriceRange[1] === item && styles.selectedPriceText
              ]}>
                ৳{item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Food List */}
      <FlatList
        data={foods}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <Text style={styles.itemCount}>
            {foods.length} {foods.length === 1 ? 'Item' : 'Items'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No items match your filters</Text>
            <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Show all items</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.foodImage} />
            )}
            <View style={styles.foodDetails}>
              <View style={styles.foodHeader}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>৳{item.price}</Text>
              </View>
              <Text style={styles.foodCategory}>{item.category}</Text>
              {!item.available && (
                <Text style={styles.unavailableText}>Currently unavailable</Text>
              )}
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => toggleFavorite(item._id)}>
                {favorites.includes(item._id) ? (
                  <Text style={styles.favoriteIcon}>❤️</Text>
                ) : (
                  <Text style={styles.favoriteIcon}>🤍</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => handleAddToCart(item)}
                disabled={!item.available}
                style={[styles.cartButton, !item.available && styles.disabledButton]}
              >
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderRadius: 4,
  },
  clearButtonText: {
    color: 'red',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  categoryButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  selectedCategory: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    color: '#4b5563',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  priceListContainer: {
    paddingBottom: 8,
  },
  priceButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  selectedPriceButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  priceText: {
    fontSize: 14,
    color: '#4b5563',
  },
  selectedPriceText: {
    color: '#fff',
  },
  itemCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 4,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
  },
  foodCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  foodDetails: {
    padding: 16,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  unavailableText: {
    fontSize: 12,
    color: 'red',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  cartButton: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cartButtonText: {
    color: 'white',
  },
});

export default FoodScreen;