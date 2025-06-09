import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Button, Card, IconButton, Text, TextInput } from 'react-native-paper';

interface Category {
  id: string;
  name: string;
  options: string[];
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'What to eat',
    options: ['Pizza', 'Rice', 'Noodles', 'Burger', 'Salad', 'Sushi', 'Pasta', 'Steak']
  },
  {
    id: '2',
    name: 'Who gonna pay',
    options: ['Me', 'My GF', 'Split', 'Someone else', 'Take turns']
  },
  {
    id: '3',
    name: 'What to do in spare time',
    options: ['Play badminton', 'Watch movies', 'Read books', 'Play games', 'Go for a walk', 'Exercise', 'Cook', 'Sleep']
  }
];

interface CategoryManagerProps {
  onSelectCategory: (category: Category) => void;
}

export default function CategoryManager({ onSelectCategory }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newOption, setNewOption] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Load saved categories on startup
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const savedCategories = await AsyncStorage.getItem('categories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleSaveCategory = async (category: Category) => {
    try {
      const updatedCategories = categories.map(cat => 
        cat.id === category.id ? category : cat
      );
      setCategories(updatedCategories);
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
      setIsEditing(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      options: []
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setNewCategoryName('');
    setShowAddCategory(false);
    
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            const updatedCategories = categories.filter(cat => cat.id !== categoryId);
            setCategories(updatedCategories);
            try {
              await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
            } catch (error) {
              console.error('Error deleting category:', error);
            }
          }
        }
      ]
    );
  };

  const handleAddOption = () => {
    if (!editingCategory || !newOption.trim()) return;
    
    const updatedCategory = {
      ...editingCategory,
      options: [...editingCategory.options, newOption.trim()]
    };
    setEditingCategory(updatedCategory);
    setNewOption('');
  };

  const handleRemoveOption = (optionToRemove: string) => {
    if (!editingCategory) return;
    
    const updatedCategory = {
      ...editingCategory,
      options: editingCategory.options.filter(opt => opt !== optionToRemove)
    };
    setEditingCategory(updatedCategory);
  };

  const renderEditCategory = () => (
    <View style={styles.editContainer}>
      <View style={styles.editHeader}>
        <Text style={styles.editTitle}>Edit {editingCategory?.name}</Text>
        <IconButton
          icon="close"
          size={24}
          onPress={() => {
            setIsEditing(false);
            setEditingCategory(null);
          }}
        />
      </View>

      {/* <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Category Name</Text>
        <TextInput
          value={editingCategory?.name || ''}
          onChangeText={(text) => 
            editingCategory && setEditingCategory({ ...editingCategory, name: text })
          }
          mode="outlined"
          style={styles.input}
        />
      </View> */}

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Options:</Text>
        <ScrollView style={styles.optionsScrollView}>
          {editingCategory?.options.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <Text style={styles.optionText}>{option}</Text>
              <IconButton
                icon="close"
                size={20}
                onPress={() => handleRemoveOption(option)}
                style={styles.optionDeleteButton}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.addOptionRow}>
          <TextInput
            label="Add New Option"
            value={newOption}
            onChangeText={setNewOption}
            style={styles.flexInput}
            mode="outlined"
          />
          <IconButton
            icon="plus-circle"
            onPress={handleAddOption}
            disabled={!newOption.trim()}
            size={30}
            iconColor="#ff7f50"
          />
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => {
            setIsEditing(false);
            setEditingCategory(null);
          }}
          style={styles.actionButton}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={() => editingCategory && handleSaveCategory(editingCategory)}
          style={styles.actionButton}
        >
          Save
        </Button>
      </View>
    </View>
  );

  const renderAddCategory = () => (
    <View style={styles.editContainer}>
      <View style={styles.editHeader}>
        <Text style={styles.editTitle}>Add New Category</Text>
        <IconButton
          icon="close"
          size={24}
          onPress={() => setShowAddCategory(false)}
        />
      </View>

      {/* <View style={styles.sectionContainer}>
        <TextInput
          label="Category Name"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          mode="outlined"
          style={styles.input}
        />
      </View> */}

      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => setShowAddCategory(false)}
          style={styles.actionButton}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleAddCategory}
          style={styles.actionButton}
          disabled={!newCategoryName.trim()}
        >
          Add
        </Button>
      </View>
    </View>
  );

  if (isEditing && editingCategory) {
    return renderEditCategory();
  }

  if (showAddCategory) {
    return renderAddCategory();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Category</Text>
        <Button 
          mode="contained" 
          onPress={() => setShowAddCategory(true)}
          style={styles.addButton}
          icon="plus"
        >
          Add
        </Button>
      </View>

      <ScrollView style={styles.scrollView}>
        {categories.map((category) => (
          <Card key={category.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.cardActions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => {
                      setEditingCategory(category);
                      setIsEditing(true);
                    }}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDeleteCategory(category.id)}
                  />
                </View>
              </View>
              <Text style={styles.optionCount}>
                {category.options.length} options
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => onSelectCategory(category)}
                style={styles.useButton}
              >
                Use This Wheel
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 18,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
  },
  addButton: {
    backgroundColor: '#008080',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
  },
  optionCount: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  useButton: {
    backgroundColor: '#008080',
    marginRight: 8,
  },
  editContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#008080',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008080',
  },
  input: {
    backgroundColor: 'white',
  },
  optionsScrollView: {
    maxHeight: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  optionDeleteButton: {
    margin: 0,
  },
  addOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    minWidth: 100,
  },
});