const { db } = require("../config/firebase");

class User {
  static collection = db.collection("users");

  static async create(uid, data) {
    const userData = {
      uid,
      email: data.email,
      name: data.name || "",
      phone: data.phone || "",
      avatar: data.avatar || "",
      role: data.role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.collection.doc(uid).set(userData);
    return userData;
  }

  static async findById(uid) {
    const doc = await this.collection.doc(uid).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  static async update(uid, data) {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await this.collection.doc(uid).update(updateData);
    return this.findById(uid);
  }

  static async delete(uid) {
    await this.collection.doc(uid).delete();
    return { success: true };
  }

  static async getAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = User;
