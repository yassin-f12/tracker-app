import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import TransactionList from "@/components/TransactionList";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SearchModal = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ];

  const { data: allTransactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", constraints);

  const getCategoryLabel = (value: string) => {
    return (
      expenseCategories[value]?.label?.toLowerCase() ?? value.toLowerCase()
    );
  };

  const getTypeLabel = (value: string) => {
    return (
      transactionTypes.find((t) => t.value === value)?.label?.toLowerCase() ??
      value.toLowerCase()
    );
  };

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      const searchLower = search.toLowerCase();
      const categoryLabel = getCategoryLabel(item.category ?? "");
      const typeLabel = getTypeLabel(item.type ?? "");

      if (
        categoryLabel.includes(searchLower) ||
        typeLabel.includes(searchLower) ||
        item.description?.toLowerCase()?.includes(searchLower)
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Recherche"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Rechercher une transaction..."
              value={search}
              placeholderTextColor={colors.neutral400}
              returnKeyType="search"
              containerStyle={{ backgroundColor: colors.neutral800 }}
              onChangeText={(value) => setSearch(value)}
            />
          </View>

          <View>
            <TransactionList
              loading={transactionsLoading}
              data={filteredTransactions}
              emptyListMessage="Aucune transaction correspondant à votre recherche"
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
