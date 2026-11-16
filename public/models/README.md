# Model 3D botol

Letakkan file GLB/GLTF botol di folder ini, misalnya `aira-bottle.glb`, lalu set
`BOTTLE_MODEL_URL` di `src/config/scene.ts` menjadi `'/models/aira-bottle.glb'`.

Penamaan mesh yang dikenali (tidak peka huruf besar/kecil, cukup *mengandung* kata kunci):

| Kata kunci di nama mesh | Material yang diterapkan                          |
| ----------------------- | ------------------------------------------------- |
| `glass`                 | Kaca transmisi (refraksi, aberasi kromatik)        |
| `liquid`                | Shader cairan — warnanya mengikuti varian aktif    |
| `cap`                   | Logam champagne (ikut animasi lepas saat semprot)  |
| `metal` / `collar`      | Logam champagne                                    |
| `label`                 | Dibiarkan memakai material bawaan dari file        |

Skala: tinggi botol ±2.4 unit dengan alas di y = 0 (ubah `BOTTLE_MODEL_SCALE` bila perlu).
