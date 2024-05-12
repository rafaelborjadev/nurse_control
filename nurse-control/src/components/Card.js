import { View, Text } from 'react-native';
import { Card, useTheme, Button } from 'react-native-paper';

const Cards = ({ keys, data, buttons }) => {
  const theme = useTheme();

  return (
    <>
      {data?.map((el, i) => (
        <Card key={el.id} className="mb-5">
          <Card.Title
            title={`${keys.header.label}${el[keys.header.name]}`}
            subtitle=""
            style={{
              borderColor: 'transparent',
              backgroundColor: theme.colors.primaryContainer,
              marginBottom: 10,
            }}
          />
          {keys.body.map((subEl, j) => (
            <Card.Content key={i + j} style={{ margin: 1 }}>
              {subEl?.name === 'rol' ? (
                <Text variant="bodyMedium" style={{ fontWeight: 800 }}>{`${
                  el[subEl.name]
                }`}</Text>
              ) : (
                <Text variant="bodyMedium">{`${subEl.label}${
                  el[subEl.name]
                }`}</Text>
              )}
            </Card.Content>
          ))}
          <Card.Actions>
            {buttons?.map((button, i) => (
              <Button
                key={i}
                icon={button.icon}
                mode="elevated"
                className={button.className}
                style={button.style}
                onPress={() => button.action(el)}
              >
                {button.buttonText}
              </Button>
            ))}
          </Card.Actions>
        </Card>
      ))}
    </>
  );
};

export default Cards;
