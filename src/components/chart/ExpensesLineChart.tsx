// src/components/chart/ExpensesLineChart.tsx
import { Transaction } from '@/src/models/Transaction';
import { getDayKey, groupBy } from '@/src/services/dateUtils'; // Assumindo que você criou este helper
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Supondo que você tenha um arquivo de constantes para cores, ou usará NativeWind
const THEME_COLORS = { // Mock de cores do tema
  primary: 'purple',
  chartLine: 'rgba(134, 65, 244, 1)', // Cor para a linha do gráfico
  chartLabel: 'rgba(0, 0, 0, 0.6)',
  background: '#FFFFFF',
  text: '#333333',
};

const screenWidth = Dimensions.get('window').width;

interface ExpensesLineChartProps {
  transactions: Transaction[];
}

interface DailyTotal {
  date: Date; // Guardamos o objeto Date original do primeiro item do dia para ordenação
  dayKey: string; // YYYY-MM-DD
  total: number;
}

export default function ExpensesLineChart({ transactions }: ExpensesLineChartProps) {
  const chartData = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = transactions.filter(
      (transaction) => transaction.date >= thirtyDaysAgo
    );

    if (recentTransactions.length === 0) {
      return null; // Retorna null se não houver dados para exibir
    }

    const groupedByDay = groupBy(recentTransactions, (tr) => getDayKey(tr.date));

    const dailyTotalsArray: DailyTotal[] = Object.keys(groupedByDay)
      .map((dayKey) => {
        const transactionsForDay = groupedByDay[dayKey as keyof typeof groupedByDay];
        const total = transactionsForDay.reduce((sum, tr) => sum + tr.value, 0);
        return {
          date: transactionsForDay[0].date, // Pega a data do primeiro item para ordenação
          dayKey,
          total,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Ordena por data

    // Preparar dados para react-native-chart-kit
    // Precisamos de um número limitado de labels para não poluir o eixo X.
    // Vamos mostrar, por exemplo, a cada 5 dias ou um máximo de 6-7 labels.
    const labels: string[] = [];
    const dataPoints: number[] = [];

    const numLabels = Math.min(dailyTotalsArray.length, 7); // Máximo de 7 labels
    const divisorParaStep = numLabels > 1 ? numLabels - 1 : 1; // Evita divisão por zero e garante pelo menos 1
    const step = Math.max(1, Math.floor(dailyTotalsArray.length / divisorParaStep));


    dailyTotalsArray.forEach((item, index) => {
      // Adiciona o label de forma mais espaçada para não poluir
      if (index % step === 0 || index === dailyTotalsArray.length - 1) {
        const date = new Date(item.dayKey + 'T00:00:00'); // Garante que é UTC para evitar problemas de timezone na formatação
        labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
      } else if (numLabels < 5 && dailyTotalsArray.length < 10) { // Se poucos dados, mostrar mais labels
         const date = new Date(item.dayKey + 'T00:00:00');
         labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
      }
      else {
        labels.push(''); // Label vazio para espaçamento
      }
      dataPoints.push(item.total);
    });
    
    // Se o último label não foi adicionado e é diferente do penúltimo
    if (labels.length > 0 && dailyTotalsArray.length > 0) {
        const lastDailyTotal = dailyTotalsArray[dailyTotalsArray.length -1];
        const lastDateFormatted = new Date(lastDailyTotal.dayKey + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
        if (labels[labels.length-1] !== lastDateFormatted && labels.length < dailyTotalsArray.length) {
            if (labels[labels.length-1] === '') labels[labels.length-1] = lastDateFormatted;
            else if (labels.length < 7 ) labels.push(lastDateFormatted) // Evitar muitos labels
        }
    }


    // Garantir que temos pelo menos um label se houver dados
    if (labels.length === 0 && dataPoints.length > 0) {
       const date = new Date(dailyTotalsArray[0].dayKey + 'T00:00:00');
       labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
    }
    // Se houver apenas um ponto de dado, duplique-o para o gráfico de linha poder ser desenhado
    if (dataPoints.length === 1) {
        dataPoints.push(dataPoints[0]);
        if(labels.length === 1) labels.push(" "); // Adiciona um segundo label vazio
    }


    return {
      labels: labels.length > 0 ? labels : ["Sem Dados"], // Labels para o eixo X
      datasets: [
        {
          data: dataPoints.length > 0 ? dataPoints : [0], // Valores para o eixo Y
          color: (opacity = 1) => THEME_COLORS.chartLine, // Cor da linha
          strokeWidth: 2,
        },
      ],
      legend: ['Gastos Diários (Últimos 30 dias)'], // Legenda do gráfico
    };
  }, [transactions]);

  if (!chartData) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Sem dados suficientes para exibir o gráfico de linha.</Text>
      </View>
    );
  }
  
  // Evitar renderizar gráfico com dados insuficientes para react-native-chart-kit (precisa de pelo menos 1 item em labels e data)
  if (chartData.labels.length === 0 || (chartData.datasets[0] && chartData.datasets[0].data.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Preparando dados do gráfico...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desempenho Mensal</Text>
      <LineChart
        data={chartData}
        width={screenWidth * 0.9} // Largura do gráfico (90% da tela)
        height={220}
        yAxisLabel="R$"
        yAxisSuffix=""
        yAxisInterval={1} // opcional, calcula automaticamente
        chartConfig={{
          backgroundColor: THEME_COLORS.background,
          backgroundGradientFrom: THEME_COLORS.background,
          backgroundGradientTo: THEME_COLORS.background,
          decimalPlaces: 2, // casas decimais para os valores do eixo Y
          color: (opacity = 1) => `rgba(100, 0, 128, ${opacity})`, // Cor base para gradientes e labels (roxo)
          labelColor: (opacity = 1) => THEME_COLORS.chartLabel, // Cor dos labels dos eixos
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4', // Raio dos pontos na linha
            strokeWidth: '2',
            stroke: THEME_COLORS.primary,
          },
          propsForBackgroundLines: {
            strokeDasharray: '', // Linhas sólidas
            stroke: 'rgba(0,0,0,0.1)', // Cor das linhas de grade
          }
        }}
        bezier // para fazer a linha curvada (estilo Bezier)
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        // verticalLabelRotation={30} // Rotaciona os labels do eixo X se necessário
        // fromZero={true} // Garante que o eixo Y comece do zero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLORS.background,
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 15,
    marginTop: 20,
    // Sombra (opcional, similar ao Card)
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: THEME_COLORS.text,
  },
  noDataText: {
    fontSize: 14,
    color: 'gray',
    padding: 20,
  }
});