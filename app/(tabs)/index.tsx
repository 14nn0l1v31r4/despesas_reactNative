// app/(tabs)/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform, // Adicionado para o FAB
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Modelos, Contexto e Componentes Reais
import { Transaction } from '@/src/models/Transaction'; // Já deve existir
import { useTransactions } from '@/src/context/TransactionContext'; // Usar o contexto
import TransactionForm from '@/src/components/transactions/TransactionForm'; // Componente real
import TransactionList from '@/src/components/transactions/TransactionList'; // Componente real
import ExpensesChart from '@/src/components/chart/ExpensesChart'; // Componente real
import ExpensesLineChart from '@/src/components/chart/ExpensesLineChart'; // Componente real

// Cores (exemplo, use seu sistema de tema ou NativeWind)
const THEME_COLORS = {
  primary: 'purple',
  secondary: 'pink',
  white: '#FFFFFF',
  backgroundScreen: '#F8EDF9',
  fabBackground: 'pink', // Cor do FAB
  iconColor: 'purple', // Cor para ícones do header
  modalBackground: 'rgba(0,0,0,0.5)',
  placeholderText: 'gray',
};

export default function HomeScreen() {
  const router = useRouter();
  // Obter dados e funções do TransactionContext
  const {
    transactions,
    addTransaction,
    removeTransaction,
    recentTransactions,
  } = useTransactions();

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);

  // Handler para adicionar transação (agora usa a função do contexto)
  const handleAddTransaction = (title: string, value: number, date: Date) => {
    addTransaction(title, value, date); // Chama a função do contexto
    setIsFormModalVisible(false); // Fecha o modal
  };

  // Handler para remover transação (agora usa a função do contexto)
  // A confirmação (Alert) estará dentro do TransactionListItem
  const handleRemoveTransaction = (id: string) => {
    removeTransaction(id); // Chama a função do contexto
  };

  const openTransactionFormModal = () => {
    setIsFormModalVisible(true);
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: 'Despesas Pessoais',
          headerStyle: { backgroundColor: THEME_COLORS.primary },
          headerTintColor: THEME_COLORS.white,
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity
              onPress={openTransactionFormModal}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="add-circle"
                size={28}
                color={THEME_COLORS.white} // Ícone branco no header roxo
              />
            </TouchableOpacity>
          ),
          // Exemplo de botão para navegação para Relatório (se não estiver no Drawer)
          // Se você tiver um Drawer, este botão pode não ser necessário aqui.
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/report')} // Navega para a tela de relatório
              style={{ marginLeft: 15 }}
            >
              <Ionicons
                name="document-text-outline"
                size={26}
                color={THEME_COLORS.white}
              />
            </TouchableOpacity>
          ),
        }}
      />

        {/* Renderiza o gráfico de barras com as transações recentes */}
        <ExpensesChart recentTransactions={recentTransactions} />

        {/* Renderiza a lista de transações */}
        <TransactionList
          transactions={transactions}
          onRemove={handleRemoveTransaction} // Passa a função de remoção
        />

        {/* Renderiza o gráfico de linha com todas as transações */}
        <ExpensesLineChart transactions={transactions} />
      

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openTransactionFormModal}
      >
        <Ionicons name="add" size={30} color={THEME_COLORS.white} />
      </TouchableOpacity>

      {/* Modal para o TransactionForm */}
      <Modal
        visible={isFormModalVisible}
        onRequestClose={() => setIsFormModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainerForForm}>
          <TransactionForm
            onSubmit={handleAddTransaction}
            onClose={() => setIsFormModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME_COLORS.backgroundScreen,
  },
  body: {
    paddingBottom: 80, // Espaço para o FAB não sobrepor conteúdo da ScrollView
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: THEME_COLORS.fabBackground,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: Platform.OS === 'android' ? 6 : 0, // Sombra para Android
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
    shadowRadius: Platform.OS === 'ios' ? 3 : 0,
  },
  modalContainerForForm: {
    flex: 1,
    justifyContent: 'flex-end', // Posiciona o formulário na parte inferior
    backgroundColor: THEME_COLORS.modalBackground,
  },
  // PlaceholderText não é mais necessário se os componentes reais forem usados
  // placeholderText: {
  //   textAlign: 'center',
  //   padding: 20,
  //   fontSize: 16,
  //   color: THEME_COLORS.placeholderText,
  // },
}); 