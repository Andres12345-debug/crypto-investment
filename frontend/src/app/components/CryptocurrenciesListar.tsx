import { useEffect, useState } from "react";
import { cryptocurrencies } from "../../models/Cryptocurrencies";
import { ServicioGet } from "../../services/ServicioGet";
import { URLS } from "../../utilities/dominios/urls";

export const CryptocurrenciesListar = () => {
  const [arrCryptos, setArrCryptos] = useState<cryptocurrencies[]>([]);

  const consultar = async () => {
    const urlServicio = URLS.URL_BASE + URLS.LISTAR;
    const resultado = await ServicioGet.peticionGet(urlServicio);
    setArrCryptos(Array.isArray(resultado) ? resultado : []); // Asegura arreglo
  };

  useEffect(() => {
    consultar();
  }, []);

  return (
    <div>
      <h2>Lista de Criptomonedas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Símbolo</th>
            <th>Slug</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {arrCryptos.map((crypto) => (
            <tr key={crypto.idCripto}>
              <td>{crypto.name}</td>
              <td>{crypto.symbol}</td>
              <td>{crypto.slug}</td>
              <td>{crypto.isActive ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
