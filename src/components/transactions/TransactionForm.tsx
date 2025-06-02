// src/components/transactions/TransactionForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  Alert, // Para feedback de validação
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Supondo que você tenha um arquivo de constantes para cores, ou usará NativeWind
// import { Colors } from '@/src/constants/Colors';
const THEME_COLORS = { // Mock de cores do tema
  primary: 'purple',
  secondary: 'pink',
  text: 'black',
  placeholder: 'gray',
  backgroundForm: '#F8EDF9', // const Color.fromARGB(255, 248, 237, 249)
  white: '#FFFFFF',
  lightGray: '#D3D3D3',
};

interface TransactionFormProps {
  onSubmit: (title: string, value: number, date: Date) => void;
  onClose: () => void; // Função para fechar o modal/bottom sheet
}

export default function TransactionForm({ onSubmit, onClose }: TransactionFormProps) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState(''); // Manter como string para o TextInput
  const [selectedDate, setSelectedDate] = useState(new Date()); // Inicializa com data atual
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // No iOS, o picker pode precisar ser fechado manualmente
                                           // ou mantido aberto até o usuário confirmar.
                                           // Para consistência, vamos fechar.
    if (event.type === 'dismissed') {
        setShowDatePicker(false);
        return;
    }
    if (date) {
      setSelectedDate(date);
    }
    // No Android, o picker fecha automaticamente após selecionar ou cancelar.
    // No iOS, é comum ter um botão "Concluído" ou fechar ao selecionar.
    // A lógica acima tenta um comportamento mais simples e consistente.
    if(Platform.OS !== 'ios') { // Fechar picker no Android
        setShowDatePicker(false);
    }
  };

  const handleSubmit = () => {
    const numericValue = parseFloat(value.replace(',', '.')); // Substitui vírgula por ponto para parse

    if (!title.trim() || isNaN(numericValue) || numericValue <= 0) {
      Alert.alert(
        'Dados Inválidos',
        'Por favor, preencha todos os campos corretamente (título e valor maior que zero).',
      );
      return;
    }

    Keyboard.dismiss(); // Equivalente a FocusManager.instance.primaryFocus?.unfocus();
    onSubmit(title.trim(), numericValue, selectedDate);
    onClose(); // Chama a função para fechar o modal/bottom sheet

    // Limpar campos (opcional, pois o componente pode ser desmontado ao fechar o modal)
    // setTitle('');
    // setValue('');
    // setSelectedDate(new Date());
  };

  return (
    <View style={styles.card}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor={THEME_COLORS.placeholder}
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmit} // Chama handleSubmit ao pressionar "Enter" no teclado
      />
      <TextInput
        style={styles.input}
        placeholder="Valor (R$)"
        placeholderTextColor={THEME_COLORS.placeholder}
        value={value}
        onChangeText={setValue}
        keyboardType="numeric" // Em vez de numberWithOptions(decimal: true)
        onSubmitEditing={handleSubmit}
      />

      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          Data: {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>Selecionar Data</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'} // 'spinner' para iOS, 'default' (calendário/relógio) para Android
          onChange={handleDateChange}
          maximumDate={new Date()} // Não permite selecionar datas futuras (como no original)
          minimumDate={new Date(2024, 0, 1)} // Ex: DateTime(2024)
        />
      )}
      {/* Botão "Concluído" para o DatePicker no iOS, se display for 'spinner' e não fechar no onChange */}
      {Platform.OS === 'ios' && showDatePicker && (
         <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Concluído</Text>
        </TouchableOpacity>
      )}


      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Nova Transação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME_COLORS.backgroundForm,
    padding: 15, // Equivalente ao Padding(all: 10) mas um pouco mais espaçoso
    // Para a elevação/sombra do Card:
    borderRadius: 8, // Adicionar bordas arredondadas
    margin: 10, // Margem para o "Card" não colar nas bordas do modal
    // Sombra para Android
    elevation: 5,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    height: 50, // Altura aumentada para melhor toque
    borderColor: THEME_COLORS.lightGray,
    borderBottomWidth: 1, // Em vez de InputDecoration padrão, usamos borda inferior
    marginBottom: 15, // Espaçamento aumentado
    fontSize: 16,
    paddingHorizontal: 5,
    color: THEME_COLORS.text,
  },
  dateContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: THEME_COLORS.text,
  },
  datePickerButtonText: {
    color: THEME_COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: THEME_COLORS.primary, // Cor primária para o botão principal
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Bordas arredondadas
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: THEME_COLORS.white, // Texto branco para contraste
    fontSize: 16,
    fontWeight: 'bold', // Equivalente a FontWeight.w700
  },
  doneButton: { // Botão para fechar o DatePicker no iOS
    padding: 10,
    alignItems: 'flex-end',
    backgroundColor: '#f0f0f0', // Um fundo leve para o botão
  },
  doneButtonText: {
    color: THEME_COLORS.primary,
    fontWeight: 'bold',
  }
});