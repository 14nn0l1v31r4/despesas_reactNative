// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons'; // Para os ícones
import { Drawer } from 'expo-router/drawer'; // Importar Drawer
import React from 'react';

// Seus imports de tema (Colors, useColorScheme) ainda podem ser úteis para estilizar o Drawer
import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';

// Componentes customizados como HapticTab e TabBarBackground não são diretamente aplicáveis ao Drawer,
// mas você pode ter outras customizações para o Drawer se desejar.

export default function TabLayout() { // Renomeado de TabLayout para AppDrawerLayout para clareza
  const colorScheme = useColorScheme();
  const activeTintColor = Colors[colorScheme ?? 'light'].tint; // Exemplo de cor ativa
  const inactiveTintColor = Colors[colorScheme ?? 'light'].tabIconDefault; // Exemplo de cor inativa

  return (
    <Drawer
      screenOptions={{
        headerShown: true, // Para exibir o cabeçalho em cada tela do Drawer (onde o botão de menu aparecerá)
        drawerActiveTintColor: activeTintColor,
        drawerInactiveTintColor: inactiveTintColor,
        // drawerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background }, // Estilo do corpo do drawer
        // Você pode adicionar mais screenOptions globais para o Drawer aqui
      }}
    >
      <Drawer.Screen
        name="index" // Corresponde ao arquivo app/(tabs)/index.tsx (sua HomeScreen)
        options={{
          drawerLabel: 'Início', // Texto que aparece no menu lateral
          title: 'Despesas Pessoais', // Título no cabeçalho da tela "Início"
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Se você quiser adicionar a tela "Explore" de volta, mas como um item de menu: */}
      
      {/* Você também pode adicionar a tela de "Relatório" aqui se quiser que ela seja parte do Drawer:
          Para isso, o arquivo app/report.tsx precisaria ser movido para app/(tabs)/report.tsx
      <Drawer.Screen
        name="report" // Se report.tsx estiver em app/(tabs)/report.tsx
        options={{
          drawerLabel: 'Relatório',
          title: 'Relatório',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      */}
    </Drawer>
  );
}