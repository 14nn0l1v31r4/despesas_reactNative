// src/components/chart/ExpensesChart.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '@/src/models/Transaction';
import ChartBar from './ChartBar';

// Supondo que você tenha um arquivo de constantes para cores, ou usará NativeWind
const THEME_COLORS = { // Mock de cores do tema
  white: '#FFFFFF',
  text: '#333333',
};

interface GroupedTransactionValue {
  day: string; // Ex: 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'
  value: number;
}

interface ExpensesChartProps {
  recentTransactions: Transaction[];
}

export default function ExpensesChart({ recentTransactions }: ExpensesChartProps) {
  const groupedTransactionValues = useMemo((): GroupedTransactionValue[] => {
    return Array.from({ length: 7 }, (_, i) => {
      const weekDay = new Date();
      weekDay.setDate(weekDay.getDate() - i); // i=0 é hoje, i=1 é ontem, etc.

      let totalSum = 0;
      for (const trans of recentTransactions) {
        if (
          trans.date.getDate() === weekDay.getDate() &&
          trans.date.getMonth() === weekDay.getMonth() &&
          trans.date.getFullYear() === weekDay.getFullYear()
        ) {
          totalSum += trans.value;
        }
      }

      // Formatar o dia da semana para 'pt-BR' e pegar a primeira letra maiúscula
      // O DateFormat.E('pt-br').format(weekDay)[0].toUpperCase() do Dart
      // pode ser replicado de forma simples com toLocaleDateString.
      // Para 'S', 'T', 'Q', 'Q', 'S', 'S', 'D' (Seg, Ter, Qua, Qui, Sex, Sab, Dom)
      // Nota: A ordem e a letra exata podem variar um pouco com toLocaleDateString
      // dependendo da implementação do JS e se o locale 'pt-BR' está totalmente disponível
      // para formatação de nomes de dias curtos.
      // Uma biblioteca como date-fns com o locale ptBR daria mais controle:
      // import { format, subDays } from 'date-fns';
      // import { ptBR } from 'date-fns/locale';
      // format(subDays(new Date(), i), 'E', { locale: ptBR })[0].toUpperCase();
      
      const dayLabel = weekDay.toLocaleDateString('pt-BR', { weekday: 'narrow' });
      // 'narrow' pode dar 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'.
      // 'short' daria 'seg.', 'ter.', etc.
      // Se 'narrow' não for ideal, pode-se usar 'short' e pegar as primeiras letras,
      // ou um mapeamento manual.

      return {
        day: dayLabel.toUpperCase(),
        value: totalSum,
      };
    }).reverse(); // .reversed.toList() do Dart
  }, [recentTransactions]);

  const weekTotalValue = useMemo(() => {
    return groupedTransactionValues.reduce((sum, item) => sum + item.value, 0);
  }, [groupedTransactionValues]);

  return (
    <View style={styles.card}>
      <View style={styles.chartContainer}>
       { groupedTransactionValues.map((data, index) => (
          <View key={index} style={styles.barWrapper}>
            <ChartBar
              label={data.day}
              value={data.value}
              percentage={weekTotalValue === 0 ? 0 : data.value / weekTotalValue}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 8,
    padding: 10, // Padding do Card original
    marginVertical: 10, // margin: EdgeInsets.all(20) - ajustado para vertical
    marginHorizontal: 15, // e horizontal separadamente
    // Sombra para Android
    elevation: 6,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // mainAxisAlignment: MainAxisAlignment.spaceAround
    height: 120, // Altura para acomodar as barras e labels
    paddingVertical: 10, // Padding interno do Card
  },
  barWrapper: {
    flex: 1, // Para que cada ChartBar ocupe espaço igual (similar ao Flexible com FlexFit.tight)
    alignItems: 'center', // Centraliza o ChartBar dentro do wrapper se o ChartBar for menor
  },
});