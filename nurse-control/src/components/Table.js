import { DataTable, useTheme } from 'react-native-paper';
import { useState } from 'react';
import { Text, View } from 'react-native';

export const Table = ({ keys, data }) => {
  const theme = useTheme();
  //Data table pagination logic
  const [page, setpage] = useState(0);
  const [numberOfItemsPerPageList] = useState([5, 10, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage ?? 0;
  const to = Math.min((page + 1) * itemsPerPage, data?.length) ?? 0;
  return (
    <DataTable
      className="border-2 rounded-lg"
      style={{
        borderColor: 'transparent',
        backgroundColor: theme.colors.primaryContainer,
      }}
    >
      <DataTable.Header
        className="p-2 border-b-1.5 rounded-t-lg"
        style={{
          borderBottomColor: theme.colors.secondary,
          backgroundColor: theme.colors.primary,
        }}
      >
        {keys.map((header) => (
          <View
            key={header.name}
            style={{
              flex: 1,
              flexWrap: 'nowrap',
            }}
          >
            <Text className="text-white text-base">{header.label}</Text>
          </View>
        ))}
      </DataTable.Header>

      {data?.slice(from, to)?.map((el) => (
        <DataTable.Row
          key={el.id}
          className="p-2 border-b-1.5"
          style={{ borderBottomColor: theme.colors.secondary }}
        >
          {keys.map((key, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                flexWrap: 'nowrap',
              }}
            >
              <Text className="p-0">{el[key.name]}</Text>
            </View>
          ))}
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(data?.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${data?.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Elementos por pagina'}
      />
    </DataTable>
  );
};
