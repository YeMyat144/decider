import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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

  if (isEditing && editingCategory) {
    return (
      <View style={styles.container}>
        <View style={styles.editHeader}>
          <Text style={styles.modalTitle}>Edit {editingCategory.name}</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => {
              setIsEditing(false);
              setEditingCategory(null);
            }}
          />
        </View>
        
        <TextInput
          label="Category Name"
          value={editingCategory.name}
          onChangeText={(text) => 
            setEditingCategory({ ...editingCategory, name: text })
          }
          style={styles.input}
        />
        
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Options:</Text>
          <ScrollView style={styles.optionsList}>
            {editingCategory.options.map((option, index) => (
              <View key={index} style={styles.optionItem}>
                <Text>{option}</Text>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => handleRemoveOption(option)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.addOptionContainer}>
          <TextInput
            label="Add New Option"
            value={newOption}
            onChangeText={setNewOption}
            style={styles.input}
          />
          <IconButton
            icon="plus"
            size={24}
            onPress={handleAddOption}
            disabled={!newOption.trim()}
          />
        </View>

        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={() => {
              setIsEditing(false);
              setEditingCategory(null);
            }}
            style={styles.modalButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={() => handleSaveCategory(editingCategory)}
            style={styles.modalButton}
          >
            Save Changes
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Category</Text>
      <ScrollView style={styles.scrollView}>
        {categories.map((category) => (
          <Card key={category.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => {
                    setEditingCategory(category);
                    setIsEditing(true);
                  }}
                />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#008080',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
  },
  optionCount: {
    color: '#666',
    marginTop: 4,
  },
  useButton: {
    backgroundColor: '#008080',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
  },
  input: {
    marginBottom: 16,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    minWidth: 100,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
}); 