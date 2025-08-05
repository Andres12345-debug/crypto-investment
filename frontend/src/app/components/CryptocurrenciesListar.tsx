import { useState, useEffect, useMemo, useCallback } from "react";
import { cryptocurrencies } from "../../models/Cryptocurrencies";
import { historialPrecios } from "../../models/Historial_precios";
import { ServicioGet } from "../../services/ServicioGet";
import { URLS } from "../../utilities/dominios/urls";
import { Modal, Button, Spinner, Tabs, Tab, Card, Row, Col } from "react-bootstrap";
import {
    ComposedChart,
    Line,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

interface ChartData {
    labels: string[];
    datasets: {
        precio: number[];
        volumen: number[];
    };
}

export const CryptocurrenciesListar = () => {
    const [arrCryptos, setArrCryptos] = useState<cryptocurrencies[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const [show, setShow] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState<cryptocurrencies | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loadingChart, setLoadingChart] = useState(false);
    const [activeTab, setActiveTab] = useState("combo");

    const filteredCryptos = useMemo(() => {
        return arrCryptos.filter(crypto =>
            crypto.name.toLowerCase().includes(search.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(search.toLowerCase())
        );
    }, [arrCryptos, search]);

    const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);

    const selectedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCryptos.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCryptos, currentPage, itemsPerPage]);




    const consultarHistorial = async (symbol: string) => {
        setLoadingChart(true);
        setChartData(null);
        setActiveTab("combo");

        try {
            const urlServicio = `${URLS.URL_BASE}${URLS.HISTORIAL.replace(":symbol", symbol)}`;
            const resultado = await ServicioGet.peticionGet(urlServicio);

            if (resultado?.historial) {
                const historial: historialPrecios[] = resultado.historial.map((item: any) => {
                    return new historialPrecios(
                        item.id,
                        item.criptoId,
                        item.priceUsd,
                        item.volume24h,
                        item.percentChange24h,
                        new Date(item.timestamp)
                    );
                });

                setChartData({
                    labels: historial.map((d) => d.timestamp.toLocaleTimeString()),
                    datasets: {
                        precio: historial.map((d) => parseFloat(d.priceUsd)),
                        volumen: historial.map((d) => parseFloat(d.volume24h))
                    }
                });

                // Actualizar el historial en la criptomoneda seleccionada
                setSelectedCrypto(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        historial: historial[historial.length - 1] // Tomamos el último registro como "actual"
                    };
                });
            }
        } catch (error) {
            console.error("Error loading chart data:", error);
        } finally {
            setLoadingChart(false);
        }
    };

    // Función memoizada para obtener precios
    const fetchPrecioCrypto = useCallback(async (symbol: string) => {
        try {
            const url = `${URLS.URL_BASE}${URLS.HISTORIAL.replace(":symbol", symbol)}`;
            const respuesta = await ServicioGet.peticionGet(url);

            const primerRegistro = respuesta?.historial?.[0] || {};
            return {
                symbol,
                priceUsd: primerRegistro.priceUsd || "0",
                volume24h: primerRegistro.volume24h || "0",
                percentChange24h: primerRegistro.percentChange24h || 0
            };
        } catch (error) {
            console.error(`Error al cargar precio de ${symbol}:`, error);
            return {
                symbol,
                priceUsd: "0",
                volume24h: "0",
                percentChange24h: 0
            };
        }
    }, []); // Memoizada sin dependencias


    // Función principal memoizada
    // Modificar consultar para cargar solo las de la página actual
const consultar = useCallback(async () => {
    try {
        const resultado = await ServicioGet.peticionGet(URLS.URL_BASE + URLS.LISTAR);
        const cryptosBasicas = Array.isArray(resultado) ? resultado : [];

        // Carga inicial sin datos históricos
        setArrCryptos(cryptosBasicas);

        // Cargar datos solo para la página actual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const cryptosACargar = cryptosBasicas.slice(startIndex, startIndex + itemsPerPage);
        
        const datosHistoricos = await Promise.all(
            cryptosACargar.map(crypto => fetchPrecioCrypto(crypto.symbol))
        );

        const cryptosActualizadas = cryptosBasicas.map((crypto, index) => {
            const loadedIndex = index - startIndex;
            return {
                ...crypto,
                historial: loadedIndex >= 0 && loadedIndex < datosHistoricos.length 
                    ? {
                        priceUsd: datosHistoricos[loadedIndex].priceUsd,
                        volume24h: datosHistoricos[loadedIndex].volume24h,
                        percentChange24h: datosHistoricos[loadedIndex].percentChange24h,
                        timestamp: new Date()
                    } 
                    : crypto.historial
            };
        });

        setArrCryptos(cryptosActualizadas);
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}, [fetchPrecioCrypto, currentPage]); // Añadir currentPage como dependencia
    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleShow = (crypto: cryptocurrencies) => {
        setSelectedCrypto(crypto);
        setShow(true);
        consultarHistorial(crypto.symbol);
    };

    useEffect(() => {
        consultar();
        const interval = setInterval(consultar, 60000);
        return () => clearInterval(interval);
    }, [consultar]); // Ahora consultar es una dependencia memoizada

    const formatNumber = (num: number) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
        return num.toFixed(2);
    };

    return (
        <div className="container mt-4">
            <input
                type="text"
                placeholder="Buscar por nombre o símbolo..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="form-control mb-3"
            />

            <table className="table table-striped table-bordered shadow-sm">
                <thead className="table-primary">
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Var 24h</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedItems.map((crypto) => (
                        <tr key={crypto.idCripto}>
                            <td>
                                <div><strong>{crypto.name}</strong></div>
                                <div className="text-muted small">{crypto.symbol}</div> {/* slug en texto pequeño y gris */}
                            </td>
                            <td>
                                {crypto.historial?.priceUsd
                                    ? `$${parseFloat(crypto.historial.priceUsd).toFixed(2)}`
                                    : <Spinner animation="border" size="sm" />}
                            </td>
                            <td className={
                                crypto.historial?.percentChange24h !== undefined
                                    ? Number(crypto.historial.percentChange24h) < 0
                                        ? "text-danger"
                                        : "text-success"
                                    : ""
                            }>
                                {crypto.historial?.percentChange24h !== undefined
                                    ? `${Number(crypto.historial.percentChange24h).toFixed(2)}%`
                                    : <Spinner animation="border" size="sm" />}
                            </td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => handleShow(crypto)}
                                >
                                    <i className="bi bi-graph-up-arrow me-2"></i>
                                    Ver Gráfico
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className="d-flex justify-content-center mt-3">
                <Button
                    variant="dark"
                    className="me-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Anterior
                </Button>
                <span className="align-self-center">
                    Página {currentPage} de {totalPages}
                </span>
                <Button
                    variant="outline-dark"
                    className="ms-2"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    Siguiente
                </Button>
            </div>

            <div className="text-center mt-3">
                <Button variant="primary" onClick={consultar}>
                    Actualizar datos
                </Button>
            </div>

            <Modal show={show} onHide={() => setShow(false)} size="xl">
                <Modal.Header closeButton className="border-bottom border-primary bg-light">
                    <Modal.Title>Análisis de {selectedCrypto?.name} ({selectedCrypto?.symbol})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingChart ? (
                        <div className="text-center p-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Cargando gráfico...</p>
                        </div>
                    ) : chartData ? (
                        <>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Card className="background-primary">
                                        <Card.Body>
                                            <Card.Title>Precio Actual</Card.Title>
                                            <Card.Text className="fs-3">
                                                ${chartData.datasets.precio[chartData.datasets.precio.length - 1]?.toFixed(2) || 'N/A'}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Volumen 24h</Card.Title>
                                            <Card.Text className="fs-3">
                                                ${formatNumber(chartData.datasets.volumen[chartData.datasets.volumen.length - 1] || 0)}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Cambio 24h</Card.Title>
                                            <Card.Text className={`fs-3 ${selectedCrypto?.historial && Number(selectedCrypto.historial.percentChange24h) >= 0
                                                ? "text-success"
                                                : "text-danger"
                                                }`}>
                                                {selectedCrypto?.historial
                                                    ? `${Number(selectedCrypto.historial.percentChange24h) >= 0 ? '+' : ''}${Number(selectedCrypto.historial.percentChange24h).toFixed(2)}%`
                                                    : 'N/A'}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "combo")} className="mb-3">
                                <Tab eventKey="combo" title="Precio y Volumen">
                                    <div style={{ height: '400px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart
                                                data={chartData.labels.map((label, index) => ({
                                                    fecha: label,
                                                    precio: Number(chartData.datasets.precio[index]),
                                                    volumen: Number(chartData.datasets.volumen[index])
                                                }))}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="fecha" />
                                                <YAxis yAxisId="left" domain={['auto', 'auto']} />
                                                <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
                                                <Tooltip
                                                    formatter={(value: number, name: string) => {
                                                        if (name.includes("Precio")) return [`$${value.toFixed(2)}`, "Precio (USD)"];
                                                        if (name.includes("Volumen")) return [`$${value.toLocaleString()}`, "Volumen 24h"];
                                                        return [value, name];
                                                    }}
                                                    labelFormatter={(label) => `Hora: ${label}`}
                                                />
                                                <Legend />
                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    dataKey="precio"
                                                    stroke="#8884d8"
                                                    name="Precio (USD)"
                                                    activeDot={{ r: 6 }}
                                                />
                                                <Bar
                                                    yAxisId="right"
                                                    dataKey="volumen"
                                                    barSize={20}
                                                    fill="#82ca9d"
                                                    name="Volumen 24h"
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Tab>

                                <Tab eventKey="price" title="Evolución de Precio">
                                    <div style={{ height: '400px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={chartData.labels.map((label, index) => ({
                                                    fecha: label,
                                                    precio: Number(chartData.datasets.precio[index])
                                                }))}
                                                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="fecha" />
                                                <YAxis domain={['auto', 'auto']} />
                                                <Tooltip
                                                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Precio"]}
                                                    labelFormatter={(label) => `Hora: ${label}`}
                                                />
                                                <Legend />
                                                <Area
                                                    type="monotone"
                                                    dataKey="precio"
                                                    stroke="#8884d8"
                                                    fill="#8884d8"
                                                    fillOpacity={0.1}
                                                    name="Precio (USD)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Tab>
                            </Tabs>

                        </>
                    ) : (
                        <p className="text-center">No hay datos disponibles</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};