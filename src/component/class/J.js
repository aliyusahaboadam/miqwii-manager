    <TableContainer component={Paper} sx={{ marginTop: 1 }}>
                            {
                        
                             isInitialLoad ? (<CirculerProgressLoader/>) :
                             
                             (
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="left">S/N</StyledTableCell>
                          <StyledTableCell align="left">Subjects</StyledTableCell>
                          <StyledTableCell align="right">Action</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                      ).map((row, index) => (
                          <StyledTableRow key={row.id}>
                              <StyledTableCell component="th" scope="row">
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell  component="th" scope="row">
                              {row.name}
                            </StyledTableCell>
                            <StyledTableCell component="th" align="row">
                            <div class={[dashboard['card--add-in-table'], dashboard['card--primary']].join(' ')}>
            <div class={dashboard['card_body']}>
                
                <button onClick={() => navigateToAddScore(row.id, row.name)}   className={[dashboard['btn'], dashboard['btn--block'], dashboard['btn--green']].join(' ')}> Add Score</button>
              </div>
            </div>
                            </StyledTableCell>
                                           
                          </StyledTableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[100, 200, 300, { label: 'All', value: -1 }]}
                          colSpan={3}
                          count={rows.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{
                            select: {
                              inputProps: {
                                'aria-label': 'rows per page',
                          
                              },
                              native: true,
                            },
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
            
                          sx={{
                            "& .MuiTablePagination-toolbar": { fontSize: 18 }, // Adjust font size
                            "& .MuiTablePagination-selectLabel": { fontSize: 14 },
                            "& .MuiTablePagination-input": { fontSize: 18 },
                            "& .MuiTablePagination-displayedRows": { fontSize: 14 },
                           
                          }}
                        />
                      </TableRow>
                    </TableFooter>
                    </Table>
                             )
                            
                            } 
                             
                           
                            </TableContainer>