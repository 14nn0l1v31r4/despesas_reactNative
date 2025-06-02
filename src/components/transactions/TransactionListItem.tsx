// src/components/transactions/TransactionListItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Supondo o uso de Ionicons
import { Transaction } from '@/src/models/Transaction';

// Supondo que você tenha um arquivo de constantes para cores, ou usará NativeWind
const THEME_COLORS = { // Mock de cores do tema
  primary: 'purple',
  secondary: 'pink',
  text: 'black',
  white: '#FFFFFF',
  redAccent: '#D32F2F', // Um vermelho para o botão de deletar
  lightGray: '#EEEEEE',
  avatarBackground: 'pink', // Cor para o CircleAvatar
};

interface TransactionListItemProps {
  item: Transaction;
  onRemove?: (id: string) => void; // Tornar onRemove opcional
}

export default function TransactionListItem({ item, onRemove }: TransactionListItemProps) {
  const formattedDate = item.date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleRemovePress = () => {
    if (onRemove) { // Só chama se onRemove existir
      Alert.alert(
        'Remover Despesa',
        'Deseja realmente remover esta despesa?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Remover', onPress: () => onRemove(item.id), style: 'destructive' },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.listItem}>
        <View style={styles.leading}>
          <View style={styles.circleAvatar}>
            <Text style={styles.avatarText}>R${item.value.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{formattedDate}</Text>
        </View>
        {onRemove && ( // Só renderiza o botão de deletar se onRemove for fornecido
          <TouchableOpacity onPress={handleRemovePress} style={styles.trailing}>
            <Ionicons name="trash-outline" size={24} color={THEME_COLORS.redAccent} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ... (styles como antes) ...
const styles = StyleSheet.create({
  card: { backgroundColor: THEME_COLORS.white, borderRadius: 6, marginVertical: 8, marginHorizontal: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  leading: { marginRight: 16 },
  circleAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: THEME_COLORS.avatarBackground, justifyContent: 'center', alignItems: 'center', padding: 6 },
  avatarText: { color: THEME_COLORS.white, fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: THEME_COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'gray' },
  trailing: { paddingLeft: 16 },
});