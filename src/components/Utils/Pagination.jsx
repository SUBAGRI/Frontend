    import React from "react";
    import "../../styles/Pagination.css";

    function Pagination({ ordersPerPage, totalOrders, paginate, activePage }) {
        const maxPagesToShow = 4; // Número máximo de páginas a mostrar
        const totalPages = Math.ceil(totalOrders / ordersPerPage);
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            // Si hay menos de `maxPagesToShow` páginas, muestra todas
            startPage = 1;
            endPage = totalPages;
        } else {
            // Si hay más de `maxPagesToShow` páginas, calcula el rango alrededor de la página activa
            const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
            const maxPagesAfterCurrentPage = maxPagesToShow - maxPagesBeforeCurrentPage - 1;

            if (activePage <= maxPagesBeforeCurrentPage) {
                // Si la página activa está cerca del inicio, muestra las primeras `maxPagesToShow` páginas
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (activePage + maxPagesAfterCurrentPage >= totalPages) {
                // Si la página activa está cerca del final, muestra las últimas `maxPagesToShow` páginas
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                // De lo contrario, muestra las páginas alrededor de la página activa
                startPage = activePage - maxPagesBeforeCurrentPage;
                endPage = activePage + maxPagesAfterCurrentPage;
            }
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        const handleFirstPage = () => paginate(1);
        const handleLastPage = () => paginate(totalPages);

        const handlePreviousPage = () => {
            if (activePage > 1) {
                paginate(activePage - 1);
            }
        };

        const handleNextPage = () => {
            if (activePage < totalPages) {
                paginate(activePage + 1);
            }
        };

        return (
            <div className="container is-flex column is-centered">
                <div className="column">
                    <nav className="pagination is-rounded" role="navigation" aria-label="pagination">
                        <ul className="pagination-list">
                            {/* Botón para la primera página */}
                            <li>
                                <a
                                    className={`pagination-link ${activePage === 1 ? 'is-disabled' : ''}`}
                                    onClick={handleFirstPage}
                                    aria-label="First page"
                                >
                                    Primera
                                </a>
                            </li>

                            {/* Botón de página anterior */}
                            <li>
                                <a
                                    className={`pagination-link ${activePage === 1 ? 'is-disabled' : ''}`}
                                    onClick={handlePreviousPage}
                                    aria-label="Previous page"
                                >
                                    &laquo; Anterior
                                </a>
                            </li>

                            {/* Números de página */}
                            {pageNumbers.map((number) => (
                                <li key={number}>
                                    <a
                                        href="javascript:void(0)"
                                        className={`pagination-link ${activePage === number ? 'is-current' : ''}`}
                                        onClick={() => paginate(number)}
                                    >
                                        {number}
                                    </a>
                                </li>
                            ))}

                            {/* Botón de siguiente página */}
                            <li>
                                <a
                                    className={`pagination-link ${activePage === totalPages ? 'is-disabled' : ''}`}
                                    onClick={handleNextPage}
                                    aria-label="Next page"
                                >
                                    Siguiente &raquo;
                                </a>
                            </li>

                            {/* Botón para la última página */}
                            <li>
                                <a
                                    className={`pagination-link ${activePage === totalPages ? 'is-disabled' : ''}`}
                                    onClick={handleLastPage}
                                    aria-label="Last page"
                                >
                                    Ultima
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

    export default Pagination;
