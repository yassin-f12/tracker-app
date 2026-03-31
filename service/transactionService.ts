import { firestore } from "@/config/firebase";
import { getFirestoreErrorMessage } from "@/config/firebaseErrors";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { createOrUpdateWallet } from "./walletService";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { colors } from "@/constants/theme";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>,
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Données de Transaction invalide" };
    }
    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id),
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOrignal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;

      if (shouldRevertOrignal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId,
        );
        if (!res.success) return res;
      }
    } else {
      transactionData.created = new Date();
      let res = await updateWalletNewTransaction(
        walletId,
        Number(amount!),
        type,
      );
      if (!res.success) return res;
    }

    if (image) {
      if (typeof image === "number") {
        return {
          success: false,
          msg: "Les images locales ne peuvent pas être téléchargées",
        };
      }
      const imageUploadRes = await uploadFileToCloudinary(
        image,
        "Transactions",
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Échec du téléchargement du reçu",
        };
      }

      transactionData.image = imageUploadRes.data;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};

const updateWalletNewTransaction = async (
  walletId: string,
  amount: number,
  type: string,
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Portefeuille non trouvé" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Le portefeuille sélectionné ne dispose pas d'un solde suffisant",
      };
    }

    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });
    return { success: true };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string,
) => {
  try {
    const orignalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId),
    );

    const orignalWallet = orignalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId),
    );
    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertWalletAmount =
      Number(orignalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(orignalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType === "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "Le portefeuille sélectionné ne dispose pas d'un solde suffisant",
        };
      }

      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "Le portefeuille sélectionné ne dispose pas d'un solde suffisant",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType === "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount),
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string,
): Promise<ResponseType> => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction inexistante" };
    }
    const transactionData = transactionSnapshot.data() as TransactionType;
    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    const walletSnapshot = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = walletSnapshot.data() as WalletType;

    const updateType =
      transactionType === "income" ? "totalIncome" : "totalExpenses";

    const newWalletAmount =
      walletData?.amount! -
      (transactionType === "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

    if (transactionType === "expense" && newWalletAmount < 0) {
      return {
        success: false,
        msg: "Vous ne pouvez pas supprimer cette transaction, verifier votre montant de portefeuille",
      };
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);

    return { success: true, msg: "Transaction supprimé avec succès" };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};

export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDayAgo = new Date(today);
    sevenDayAgo.setDate(today.getDate() - 7);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDayAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid),
    );

    const querySnapshot = await getDocs(transactionsQuery);
    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date === transactionDate);

      if (dayData) {
        if (transaction.type === "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};

export const fetchMonthlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid),
    );

    const querySnapshot = await getDocs(transactionsQuery);
    const monthlyData = getLast12Months();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleString("default", {
        month: "short",
      });
      const shortYear = transactionDate.getFullYear().toString().slice(-2);
      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`,
      );

      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        label: month.month,
        spacing: scale(4),
        labelWidth: scale(46),
        frontColor: colors.primary,
      },
      {
        value: month.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};

export const fetchYearlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const db = firestore;

    const transactionsQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid),
    );

    const querySnapshot = await getDocs(transactionsQuery);
    const transactions: TransactionType[] = [];

    const firstTransactions = querySnapshot.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate();
      return transactionDate < earliest ? transactionDate : earliest;
    }, new Date());

    const firstYear = firstTransactions.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstYear, currentYear);

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear();

      const yearData = yearlyData.find(
        (item) => item.year === transactionYear.toString(),
      );

      if (yearData) {
        if (transaction.type === "income") {
          yearData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          yearData.expense += transaction.amount;
        }
      }
    });

    const stats = yearlyData.flatMap((year) => [
      {
        value: year.income,
        label: year.year,
        spacing: scale(4),
        labelWidth: scale(35),
        frontColor: colors.primary,
      },
      {
        value: year.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};
