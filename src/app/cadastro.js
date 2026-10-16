import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SQLite from "expo-sqlite";

// O banco abre uma vez, fora do componente, como na aula.
const db = SQLite.openDatabaseSync("atividade.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    plataforma TEXT NOT NULL,
    horas TEXT NOT NULL
  );
`);

function listar() {
  return db.getAllSync("SELECT * FROM usuarios ORDER BY id DESC");
}

function adicionar(nome, plataforma, horas) {
  db.runSync("INSERT INTO usuarios (nome, plataforma, horas) VALUES (?, ?, ?)", [nome, plataforma, horas]);
}

function editar(id, nome, plataforma, horas) {
  db.runSync("UPDATE usuarios SET nome = ?, plataforma = ?, horas = ? WHERE id = ?", [nome, plataforma, horas, id]);
}

function excluir(id) {
  db.runSync("DELETE FROM usuarios WHERE id = ?", [id]);
}

export default function cadastro() {
  const [nome, setNome] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [horas, setHoras] = useState("");
  const [lista, setLista] = useState([]);
  const [idEdicao, setIdEdicao] = useState(null);

  function carregar() {
    setLista(listar());
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setNome("");
    setPlataforma("");
    setHoras("");
    setIdEdicao(null);
  }

  function salvar() {
    if (!nome.trim() || !plataforma.trim() || !horas.trim() ) {
      Alert.alert("Atenção", "Preencha o nome, plataforma e as horas jogadas.");
      return;
    }

    if (idEdicao !== null) {
      editar(idEdicao, nome.trim(), plataforma.trim(), horas.trim());
    } else {
      adicionar(nome.trim(), plataforma.trim(), horas.trim());
    }
    limpar();
    carregar();
  }

  function selecionar(item) {
    setIdEdicao(item.id);
    setNome(item.nome);
    setPlataforma(item.plataforma);
    setHoras(item.horas)
  }

  function remover(id) {
    Alert.alert("Excluir usuario", "Deseja excluir este usuário?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => {
        excluir(id);
        if (idEdicao === id) limpar();
        carregar();
      } },
    ]);
  }

  return (
    <SafeAreaView style={styles.tela} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Cadastro de usuários" }} />
      <TextInput style={styles.campo} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.campo} placeholder="Plataforma" value={plataforma} onChangeText={setPlataforma} />
      <TextInput style={styles.campo} placeholder="Horas" value={horas} onChangeText={setHoras} keyboardType="phone-pad" />
      <Button title={idEdicao !== null ? "Salvar alteração" : "Adicionar usuário"} onPress={salvar} />
      {idEdicao !== null && <Button title="Cancelar edição" onPress={limpar} />}

      <FlatList
        style={styles.lista}
        data={lista}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum usuario cadastrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.informacoes}>
              <Text style={styles.itemTexto}>{item.nome}</Text>
              <Text style={styles.itemTexto}>{item.plataforma}</Text>
              <Text style={styles.detalhe}>{item.horas}</Text>
            </View>
            <View style={styles.botoes}>
              <Button title="Editar" onPress={() => selecionar(item)} />
              <Button title="Excluir" color="#C62828" onPress={() => remover(item.id)} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingTop: 16 },
  campo: { borderWidth: 1, borderColor: "#D9DDE3", borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 12 },
  lista: { flex: 1, marginTop: 16 },
  item: { backgroundColor: "#F1F3F6", borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 8 },
  informacoes: { flex: 1 },
  itemTexto: { fontSize: 16, fontWeight: "600", color: "#111827" },
  detalhe: { color: "#6B7280", marginTop: 4 },
  botoes: { gap: 2 },
  vazio: { color: "#6B7280", textAlign: "center", marginTop: 20 },
});
