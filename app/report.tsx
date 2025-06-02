// app/report.tsx

import TransactionListItem from '@/src/components/transactions/TransactionListItem'; // Reutilize o item da lista

import { useTransactions } from '@/src/context/TransactionContext'; // Use o contexto

import { Stack } from 'expo-router';

import React from 'react';

import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';

// import { Transaction } from '@/src/models/Transaction'; // Não é mais necessário aqui se TransactionListItem for usado



const { height: screenHeight } = Dimensions.get('window');



// Supondo que você tenha um arquivo de constantes para cores, ou usará NativeWind

const THEME_COLORS = { // Mock de cores do tema
  backgroundScreen: '#F8EDF9', // const Color.fromARGB(255, 248, 237, 249)

  // ... outras cores se necessário

};



export default function TransactionReportScreen() {

  const { transactions } = useTransactions(); // Pega todas as transações do contexto



  const renderEmptyListComponent = () => (

    <View style={styles.emptyContainer}>

      <Text style={styles.emptyTextTitle}>Nenhuma Transação Cadastrada!</Text>

      <View style={styles.imageContainer}>

        <Image

          source={require('@/assets/images/waiting.png')} // Ajuste o caminho se necessário

          style={styles.emptyImage}

          resizeMode="contain"

        />

      </View>

    </View>

  );



  return (

    <View style={styles.screen}>

      <Stack.Screen

        options={{

          title: 'Relatório',

          // headerStyle: { backgroundColor: THEME_COLORS.primary }, // Exemplo de cor do AppBar

          // headerTintColor: THEME_COLORS.white, // Cor do título e botão de voltar

        }}

      />

      <FlatList

        data={transactions} // Usa todas as transações do contexto

        renderItem={({ item }) => (

          // Passa o item, mas NÃO passa onRemove, então o botão de deletar não aparecerá

          <TransactionListItem item={item} />

        )}

        keyExtractor={(item) => item.id}

        ListEmptyComponent={renderEmptyListComponent}

        contentContainerStyle={[

          styles.listContentContainer,

          transactions.length === 0 ? styles.emptyListContent : {}

        ]}

      // A altura do container da lista original era screenHeight * 0.67

      // Aqui, como o FlatList está no corpo principal de uma tela,

      // ele pode simplesmente preencher o espaço disponível.

      // Se você quiser a altura fixa, adicione um style: { height: screenHeight * 0.67 } ao FlatList

      />

    </View>

  );

}



const styles = StyleSheet.create({

  screen: {

    flex: 1,

    backgroundColor: THEME_COLORS.backgroundScreen,

  },

  listContentContainer: {

    paddingBottom: 10, // Um pouco de padding no final da lista

  },

  emptyContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    padding: 20,

    marginTop: screenHeight * 0.1, // Para empurrar um pouco para baixo se a lista ocupar a tela toda

  },

  emptyListContent: {

    flexGrow: 1,

    justifyContent: 'center',

  },

  emptyTextTitle: {

    fontSize: 19,

    fontWeight: 'bold',

    textAlign: 'center',

    marginBottom: 20,

  },

  imageContainer: {

    width: '80%',

    height: 250, // Ajustar conforme necessário

    marginBottom: 20,

  },

  emptyImage: {

    width: '100%',

    height: '100%',

  },

});