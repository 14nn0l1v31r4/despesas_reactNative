// src/components/chart/ChartBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Supondo que você tenha um arquivo de constantes para cores, ou usará NativeWind
const THEME_COLORS = { // Mock de cores do tema
  primary: 'purple',
  chartBarBackground: '#E0E0E0', // Color.fromRGBO(220, 220, 220, 1)
  black: '#000000',
  text: '#333333',
};

interface ChartBarProps {
  label: string; // Dia da semana (ex: 'S', 'T')
  value: number; // Valor gasto no dia
  percentage: number; // Percentual do valor em relação ao máximo ou total (0.0 a 1.0)
}

const BAR_MAX_HEIGHT = 60; // Altura do container da barra, como no original

export default function ChartBar({ label, value, percentage }: ChartBarProps) {
  const barFillHeight = BAR_MAX_HEIGHT * (isNaN(percentage) || percentage < 0 ? 0 : percentage);

  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        {/*
          O FittedBox do Flutter auto-ajusta o tamanho do texto.
          Em React Native, isso é mais complexo.
          Para simplificar, usamos um tamanho de fonte fixo e permitimos quebra de linha se necessário,
          ou você pode definir um numberOfLines={1} e ellipsizeMode.
          Ou, para um valor numérico, podemos apenas garantir que o container tenha altura fixa.
        */}
        <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="clip">
          {value.toFixed(0)} {/* Original usava toFixed(2), mas para caber melhor, toFixed(0) pode ser melhor */}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View style={styles.barBackground} />
        <View style={[styles.barFill, { height: barFillHeight }]} />
      </View>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // marginHorizontal: 4, // Espaçamento entre as barras, será controlado pelo componente pai (ExpensesChart)
  },
  valueContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  valueText: {
    fontSize: 10, // Ajustar conforme necessário para caber
    color: THEME_COLORS.text,
  },
  barContainer: {
    height: BAR_MAX_HEIGHT,
    width: 12,
    backgroundColor: THEME_COLORS.chartBarBackground,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: THEME_COLORS.black,
    overflow: 'hidden', // Garante que o preenchimento não exceda as bordas arredondadas
    justifyContent: 'flex-end', // Para o preenchimento começar de baixo
  },
  barBackground: { // Não estritamente necessário se barContainer tem a cor de fundo
    // Este era o container externo no Stack do Flutter
  },
  barFill: {
    backgroundColor: THEME_COLORS.primary,
    width: '100%',
    borderRadius: 4, // Um pouco menor que o container para não sobrepor a borda completamente
                    // No Flutter, o Stack com alignment.bottomCenter e borderRadius no filho funcionava bem.
                    // Aqui, o borderRadius no preenchimento pode não ser perfeito nas bordas inferiores
                    // se a altura for muito pequena. Uma alternativa é não ter borderRadius no fill.
  },
  labelText: {
    marginTop: 5,
    fontSize: 12,
    color: THEME_COLORS.text,
  },
});