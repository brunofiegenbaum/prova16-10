import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Inicio() {
  return (
    <SafeAreaView style={styles.tela} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Jogo do Brunin" }} />
      <Text style={styles.titulo}>Jogos</Text>
      <Text style={styles.subtitulo}>Selecione o único jogo abaixo.</Text>

      <View style={styles.cartao}>
        <Text style={styles.cartaoTitulo}>Fortnite</Text>
        <Text style={styles.detalhe}>Cadastre usuários no Fortnite.</Text>
        <Link href="/cadastro" style={styles.link}>Abrir cadastro →</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingTop: 16 },
  titulo: { fontSize: 23, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  subtitulo: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  cartao: { backgroundColor: "#F1F3F6", borderRadius: 12, padding: 16, marginBottom: 12, gap: 6 },
  cartaoTitulo: { fontSize: 17, fontWeight: "600", color: "#111827" },
  detalhe: { fontSize: 14, color: "#374151" },
  link: { fontSize: 15, fontWeight: "600", color: "#2354D6", marginTop: 4 },
});
