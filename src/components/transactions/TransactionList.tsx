  // src/components/transactions/TransactionList.tsx
  import { Transaction } from '@/src/models/Transaction';
  import React from 'react';
  import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
  import TransactionListItem from './TransactionListItem';

  interface TransactionListProps {
    transactions: Transaction[];
    onRemove: (id: string) => void;
    listHeaderComponent?: React.ReactElement | null; // Nova prop
    listFooterComponent?: React.ReactElement | null; // Nova prop
  }

  // const { height: screenHeight } = Dimensions.get('window'); // Não é mais necessário para altura fixa

  export default function TransactionList({
    transactions,
    onRemove,
    listHeaderComponent,
    listFooterComponent,
  }: TransactionListProps) {
    const renderEmptyListComponent = () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTextTitle}>Nenhuma Transação Cadastrada!</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/waiting.png')} // Certifique-se que este caminho está correto
            style={styles.emptyImage}
            resizeMode="contain"
          />
        </View>
      </View>
    );

    return (
      <FlatList
          style={styles.flatListStyle} // Aplicando o estilo diretamente no FlatList
          data={transactions}
          renderItem={({ item }) => (
            <TransactionListItem item={item} onRemove={onRemove} />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyListComponent}
          ListHeaderComponent={listHeaderComponent}
          ListFooterComponent={listFooterComponent}
          contentContainerStyle={
            transactions.length === 0
              ? styles.emptyListContentContainer
              : styles.listContentContainer
          }
        />
    )
  }

  // Dentro do StyleSheet.create em src/components/transactions/TransactionList.tsx
  const styles = StyleSheet.create({
    flatListStyle: { // Novo estilo para o FlatList
      flex: 1, // Para o FlatList ocupar o espaço disponível no componente pai (HomeScreen)
    },
    listContentContainer: { // Estilo para o container interno do FlatList quando tem itens
      paddingBottom: 16, // Um pouco de espaço no final
    },
    emptyContainer: { // Estilo para o componente quando a lista está vazia
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyListContentContainer: { // Estilo para o container interno do FlatList quando vazio
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
      aspectRatio: 1, 
      maxHeight: 250, 
      marginBottom: 20,
    },
    emptyImage: {
      width: '100%',
      height: '100%',
    },
    // Se você tinha 'listContainerOverall' antes e ele tinha outros estilos além de flex:1,
    // você pode precisar mesclar esses outros estilos em 'flatListStyle' ou repensar o layout.
    // Mas para a função de rolagem principal, flex:1 no FlatList é o crucial.
  });