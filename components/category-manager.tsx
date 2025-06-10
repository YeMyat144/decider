import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
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
  },
  {
    id: '4',
    name: 'Truth or Dare',
    options: [
      'Truth: What is your biggest fear?',
      'Truth: What is your most embarrassing moment?',
      'Truth: What is your biggest regret?',
      'Truth: What is your biggest secret?',
      'Truth: What is your biggest dream?',
      'Dare: Do your best dance move',
      'Dare: Sing a song out loud',
      'Dare: Call a friend and tell them you love them',
      'Dare: Do 10 push-ups',
      'Dare: Let someone post anything they want on your social media',
      'Dare: Let the group give you a makeover',
      'Dare: Let someone tickle you for 30 seconds'
    ]
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
  const [newCategoryOptions, setNewCategoryOptions] = useState<string[]>([]);

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

  const handleAddNewOption = () => {
    if (!newOption.trim()) return;
    setNewCategoryOptions([...newCategoryOptions, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveNewOption = (optionToRemove: string) => {
    setNewCategoryOptions(newCategoryOptions.filter(opt => opt !== optionToRemove));
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      options: newCategoryOptions
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setNewCategoryName('');
    setNewCategoryOptions([]);
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

      <View style={styles.sectionContainer}>
        <TextInput
          value={editingCategory?.name || ''}
          onChangeText={(text) => 
            editingCategory && setEditingCategory({ ...editingCategory, name: text })
          }
          mode="outlined"
          style={styles.input}
        />
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
          onPress={() => {
            setShowAddCategory(false);
            setNewCategoryName('');
            setNewCategoryOptions([]);
          }}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Options:</Text>
        <ScrollView style={styles.optionsScrollView}>
          {newCategoryOptions.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <Text style={styles.optionText}>{option}</Text>
              <IconButton
                icon="close"
                size={20}
                onPress={() => handleRemoveNewOption(option)}
                style={styles.optionDeleteButton}
              />
            </View>
          ))}
        </ScrollView>
      </View>

    <View style={styles.sectionContainer}>
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => {
            setShowAddCategory(false);
            setNewCategoryName('');
            setNewCategoryOptions([]);
          }}
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
          Save
        </Button>
      </View>
    </View>

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
            onPress={handleAddNewOption}
            disabled={!newOption.trim()}
            size={30}
            iconColor="#ff7f50"
          />
        </View>

      <View style={styles.sectionContainer}>
        <TextInput
          label="Category Name"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          mode="outlined"
          style={styles.input}
        />
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
        <Text style={styles.title}>Choose Category</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  addButton: {
    backgroundColor: '#008080',
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionCount: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  useButton: {
    backgroundColor: '#008080',
    marginRight: 8,
    borderRadius: 12,
  },
  editContainer: {
    flex: 1,
    padding: 10,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  editTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E293B',
  },
  input: {
    backgroundColor: 'white',
    marginTop: 12,
    borderRadius: 12,
  },
  optionsScrollView: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    color: '#1E293B',
    fontWeight: '500',
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
    minWidth: 120,
    borderRadius: 12,
    borderColor: '#E2E8F0',
  },
});